package com.autoservicehub.security;

import com.autoservicehub.entity.Role;
import com.autoservicehub.entity.User;
import com.autoservicehub.repository.RoleRepository;
import com.autoservicehub.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Import(JwtAuthenticationFilterIntegrationTest.EndpointConfiguration.class)
class JwtAuthenticationFilterIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Test
    void accessTokenAuthenticatesProtectedRequest() throws Exception {
        Role role = new Role();
        role.setName("ADMIN");
        role.setDescription("Test administrator");
        role = roleRepository.save(role);

        User user = new User();
        user.setUsername("jwt-filter-test");
        user.setEmail("jwt-filter-test@example.com");
        user.setPasswordHash(passwordEncoder.encode("test-only-password"));
        user.setFullName("JWT Filter Test");
        user.setActive(true);
        user.setRole(role);
        userRepository.save(user);

        String token = tokenProvider.generateAccessToken("jwt-filter-test", "ADMIN");

        mockMvc.perform(get("/api/v1/test-auth")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk());
    }

    @TestConfiguration
    static class EndpointConfiguration {
        @Bean
        TestAuthenticationEndpoint testAuthenticationEndpoint() {
            return new TestAuthenticationEndpoint();
        }
    }

    @RestController
    static class TestAuthenticationEndpoint {
        @GetMapping("/api/v1/test-auth")
        String authenticated() {
            return "ok";
        }
    }
}
