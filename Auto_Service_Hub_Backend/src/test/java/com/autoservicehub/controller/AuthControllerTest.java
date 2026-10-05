package com.autoservicehub.controller;

import com.autoservicehub.entity.Role;
import com.autoservicehub.entity.User;
import com.autoservicehub.exception.GlobalExceptionHandler;
import com.autoservicehub.repository.UserRepository;
import com.autoservicehub.security.JwtTokenProvider;
import com.autoservicehub.service.PasswordResetService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Controller slice tests for {@code AuthController.login} (SRS 2.4, 19).
 *
 * <p>The behaviour pinned here is the bug being fixed: a rejected credential must
 * come back as <strong>401 UNAUTHORIZED</strong>, not the 500 that the generic
 * {@code Exception} handler used to produce. A 500 blames the server and tells
 * the client nothing about whether to retry.
 *
 * <p>No database or filter chain is involved, so these do not depend on the H2
 * schema issue.
 */
@WebMvcTest(controllers = AuthController.class)
@Import({AuthControllerTest.TestSecurityConfig.class, GlobalExceptionHandler.class})
class AuthControllerTest {

    /**
     * The project's minimal slice security config, matching the other controller
     * tests: CSRF off (token-based API), stateless, and the standard 401/403
     * handlers. {@code /api/v1/auth/**} is permitted so the login route can be
     * exercised without a token — which is the point of the route.
     */
    @EnableMethodSecurity
    static class TestSecurityConfig {
        @Bean
        SecurityFilterChain testFilterChain(HttpSecurity http) throws Exception {
            http
                .csrf(csrf -> csrf.disable())
                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .exceptionHandling(ex -> ex
                    .authenticationEntryPoint((req, res, e) ->
                        res.sendError(jakarta.servlet.http.HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized"))
                    .accessDeniedHandler((req, res, e) ->
                        res.sendError(jakarta.servlet.http.HttpServletResponse.SC_FORBIDDEN, "Forbidden")))
                .authorizeHttpRequests(auth -> auth
                    .requestMatchers("/api/v1/auth/**").permitAll()
                    .anyRequest().authenticated());
            return http.build();
        }
    }

    @Autowired MockMvc mockMvc;

    @MockBean AuthenticationManager authenticationManager;
    @MockBean JwtTokenProvider       jwtTokenProvider;
    @MockBean PasswordResetService   passwordResetService;
    @MockBean UserRepository         userRepository;

    // JwtAuthenticationFilter is a @Component and gets picked up by the slice; it
    // would otherwise be constructed and demand a real UserDetailsService. Both
    // are mocked out so the test exercises only the login route, as the other
    // controller slices in this project already do.
    @MockBean com.autoservicehub.security.JwtAuthenticationFilter jwtAuthenticationFilter;
    @MockBean com.autoservicehub.security.CustomUserDetailsService customUserDetailsService;

    private static final String BODY = "{\"username\":\"anil\",\"password\":\"correct-horse\"}";

    /**
     * Spring Boot auto-registers every {@code Filter} bean into the servlet
     * chain. A mocked {@code JwtAuthenticationFilter} therefore receives the
     * request, does nothing, and — crucially — never calls
     * {@code chain.doFilter}, so the request dies with an empty 200 and never
     * reaches the controller. Making the mock delegate through restores the
     * chain, exactly as the other controller slices in this project already do.
     */
    @BeforeEach
    void makeTheMockedFilterPassThrough() throws Exception {
        org.mockito.Mockito.doAnswer(invocation -> {
            jakarta.servlet.http.HttpServletRequest  req   = invocation.getArgument(0);
            jakarta.servlet.http.HttpServletResponse res   = invocation.getArgument(1);
            jakarta.servlet.FilterChain                chain = invocation.getArgument(2);
            chain.doFilter(req, res);
            return null;
        }).when(jwtAuthenticationFilter).doFilter(
                any(jakarta.servlet.http.HttpServletRequest.class),
                any(jakarta.servlet.http.HttpServletResponse.class),
                any(jakarta.servlet.FilterChain.class));
    }

    private User givenUserWithRole(String username, String roleName) {
        Role role = new Role();
        role.setName(roleName);
        User user = new User();
        user.setId(1L);
        user.setUsername(username);
        user.setPasswordHash("$2a$10$hash");
        user.setActive(true);
        user.setRole(role);
        return user;
    }

    private void givenSuccessfulLogin(String storedRole) {
        when(authenticationManager.authenticate(any())).thenReturn(
                new UsernamePasswordAuthenticationToken("anil", "n/a", java.util.List.of()));
        when(userRepository.findByUsernameIgnoreCase("anil"))
                .thenReturn(Optional.of(givenUserWithRole("anil", storedRole)));
        when(jwtTokenProvider.generateAccessToken(any(), any())).thenReturn("token-abc");
    }

    @Test
    @DisplayName("A1 valid credentials return 200 with a bearer token")
    void successfulLoginReturnsToken() throws Exception {
        givenSuccessfulLogin("SERVICE_ADVISOR");
        when(jwtTokenProvider.generateAccessToken("anil", "SERVICE_ADVISOR"))
                .thenReturn("header.payload.signature");

        mockMvc.perform(post("/api/v1/auth/login")
                       .contentType(MediaType.APPLICATION_JSON).content(BODY))
               .andExpect(status().isOk())
               .andExpect(jsonPath("$.data.accessToken").value("header.payload.signature"))
               .andExpect(jsonPath("$.data.tokenType").value("Bearer"));
    }

    @Test
    @DisplayName("A2 bad credentials return 401, not 500")
    void badCredentialsReturnUnauthorized() throws Exception {
        when(authenticationManager.authenticate(any()))
                .thenThrow(new BadCredentialsException("Bad credentials"));

        mockMvc.perform(post("/api/v1/auth/login")
                       .contentType(MediaType.APPLICATION_JSON).content(BODY))
               .andExpect(status().isUnauthorized())
               .andExpect(jsonPath("$.code").value("UNAUTHORIZED"))
               .andExpect(jsonPath("$.message").value("Invalid username or password."));
    }

    @Test
    @DisplayName("A3 any AuthenticationException maps to 401")
    void allAuthenticationFailuresAreUnauthorized() throws Exception {
        when(authenticationManager.authenticate(any()))
                .thenThrow(new AuthenticationException("disabled account") { });

        mockMvc.perform(post("/api/v1/auth/login")
                       .contentType(MediaType.APPLICATION_JSON).content(BODY))
               .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("A4 an unknown username is a 401 that does not reveal it is unknown")
    void unknownUserIsUnauthorizedAndGeneric() throws Exception {
        when(authenticationManager.authenticate(any()))
                .thenThrow(new BadCredentialsException("Bad credentials"));

        mockMvc.perform(post("/api/v1/auth/login")
                       .contentType(MediaType.APPLICATION_JSON)
                       .content("{\"username\":\"nobody\",\"password\":\"whatever\"}"))
               .andExpect(status().isUnauthorized())
               // Saying "not found" would enable username enumeration.
               .andExpect(jsonPath("$.message").value("Invalid username or password."));
    }

    @Test
    @DisplayName("A5 a blank username or password is a 400 before authentication runs")
    void blankCredentialsAreBadRequest() throws Exception {
        mockMvc.perform(post("/api/v1/auth/login")
                       .contentType(MediaType.APPLICATION_JSON)
                       .content("{\"username\":\"\",\"password\":\"\"}"))
               .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("A6 a ROLE_-prefixed stored role is issued without the prefix")
    void rolePrefixIsStrippedFromTheTokenClaim() throws Exception {
        givenSuccessfulLogin("ROLE_MANAGER");

        mockMvc.perform(post("/api/v1/auth/login")
                       .contentType(MediaType.APPLICATION_JSON).content(BODY))
               .andExpect(status().isOk());

        org.mockito.Mockito.verify(jwtTokenProvider)
                .generateAccessToken(eq("anil"), eq("MANAGER"));
    }

    @Test
    @DisplayName("A7 login is reachable without an Authorization header")
    void loginIsPubliclyAccessible() throws Exception {
        givenSuccessfulLogin("MANAGER");

        mockMvc.perform(post("/api/v1/auth/login")
                       .contentType(MediaType.APPLICATION_JSON).content(BODY))
               .andExpect(status().isOk());
    }

    // ── Token lifecycle: POST /api/v1/auth/refresh (SRS 9) ─────────────────

    private static final String REFRESH_BODY = "\"a-valid-refresh-token\"";

    private void givenValidRefreshToken() {
        when(jwtTokenProvider.validateRefreshToken("a-valid-refresh-token")).thenReturn(true);
        when(jwtTokenProvider.getUsername("a-valid-refresh-token")).thenReturn("anil");
        when(userRepository.findByUsernameIgnoreCase("anil"))
                .thenReturn(Optional.of(givenUserWithRole("anil", "MANAGER")));
        when(jwtTokenProvider.generateAccessToken("anil", "MANAGER")).thenReturn("new-access");
        when(jwtTokenProvider.generateRefreshToken("anil", "MANAGER")).thenReturn("new-refresh");
    }

    @Test
    @DisplayName("A8 login also returns a refresh token")
    void loginReturnsRefreshToken() throws Exception {
        givenSuccessfulLogin("MANAGER");
        when(jwtTokenProvider.generateRefreshToken("anil", "MANAGER")).thenReturn("refresh-xyz");

        mockMvc.perform(post("/api/v1/auth/login")
                       .contentType(MediaType.APPLICATION_JSON).content(BODY))
               .andExpect(status().isOk())
               .andExpect(jsonPath("$.data.refreshToken").value("refresh-xyz"));
    }

    @Test
    @DisplayName("A9 a valid refresh token yields a new access token")
    void validRefreshTokenReturnsNewTokens() throws Exception {
        givenValidRefreshToken();

        mockMvc.perform(post("/api/v1/auth/refresh")
                       .contentType(MediaType.APPLICATION_JSON).content(REFRESH_BODY))
               .andExpect(status().isOk())
               .andExpect(jsonPath("$.data.accessToken").value("new-access"))
               .andExpect(jsonPath("$.data.refreshToken").value("new-refresh"))
               .andExpect(jsonPath("$.data.tokenType").value("Bearer"));
    }

    @Test
    @DisplayName("A10 an invalid or expired refresh token is 401")
    void invalidRefreshTokenIsUnauthorized() throws Exception {
        when(jwtTokenProvider.validateRefreshToken("bad-token")).thenReturn(false);

        mockMvc.perform(post("/api/v1/auth/refresh")
                       .contentType(MediaType.APPLICATION_JSON).content("\"bad-token\""))
               .andExpect(status().isUnauthorized())
               .andExpect(jsonPath("$.code").value("INVALID_REFRESH_TOKEN"));
    }

    @Test
    @DisplayName("A11 a missing refresh token is 401")
    void missingRefreshTokenIsUnauthorized() throws Exception {
        mockMvc.perform(post("/api/v1/auth/refresh")
                       .contentType(MediaType.APPLICATION_JSON).content("\"\""))
               .andExpect(status().isUnauthorized())
               .andExpect(jsonPath("$.code").value("INVALID_REFRESH_TOKEN"));
    }

    @Test
    @DisplayName("A12 refresh for an unknown user is 401, and does not issue a token")
    void refreshForUnknownUserIsUnauthorized() throws Exception {
        when(jwtTokenProvider.validateRefreshToken("a-valid-refresh-token")).thenReturn(true);
        when(jwtTokenProvider.getUsername("a-valid-refresh-token")).thenReturn("ghost");
        when(userRepository.findByUsernameIgnoreCase("ghost")).thenReturn(Optional.empty());

        mockMvc.perform(post("/api/v1/auth/refresh")
                       .contentType(MediaType.APPLICATION_JSON).content(REFRESH_BODY))
               .andExpect(status().isUnauthorized());

        verify(jwtTokenProvider, never()).generateAccessToken(any(), any());
    }

    @Test
    @DisplayName("A13 a deactivated user cannot refresh, and does not receive a token")
    void refreshForDeactivatedUserIsUnauthorized() throws Exception {
        // A refresh token outlives an access token, so without re-reading the user
        // here a deactivated account could keep minting access tokens.
        User deactivated = givenUserWithRole("anil", "MANAGER");
        deactivated.setActive(false);
        when(jwtTokenProvider.validateRefreshToken("a-valid-refresh-token")).thenReturn(true);
        when(jwtTokenProvider.getUsername("a-valid-refresh-token")).thenReturn("anil");
        when(userRepository.findByUsernameIgnoreCase("anil")).thenReturn(Optional.of(deactivated));

        mockMvc.perform(post("/api/v1/auth/refresh")
                       .contentType(MediaType.APPLICATION_JSON).content(REFRESH_BODY))
               .andExpect(status().isUnauthorized());

        verify(jwtTokenProvider, never()).generateAccessToken(any(), any());
    }

    @Test
    @DisplayName("A14 a user with no assigned role cannot refresh")
    void refreshForRolelessUserIsUnauthorized() throws Exception {
        User roleless = givenUserWithRole("anil", "MANAGER");
        roleless.setRole(null);
        when(jwtTokenProvider.validateRefreshToken("a-valid-refresh-token")).thenReturn(true);
        when(jwtTokenProvider.getUsername("a-valid-refresh-token")).thenReturn("anil");
        when(userRepository.findByUsernameIgnoreCase("anil")).thenReturn(Optional.of(roleless));

        mockMvc.perform(post("/api/v1/auth/refresh")
                       .contentType(MediaType.APPLICATION_JSON).content(REFRESH_BODY))
               .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("A15 refresh is publicly reachable, since the caller has no access token")
    void refreshIsPubliclyAccessible() throws Exception {
        givenValidRefreshToken();

        mockMvc.perform(post("/api/v1/auth/refresh")
                       .contentType(MediaType.APPLICATION_JSON).content(REFRESH_BODY))
               .andExpect(status().isOk());
    }
}
