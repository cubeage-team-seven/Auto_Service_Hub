package com.autoservicehub.controller;

import com.autoservicehub.dto.ApiResponse;
import com.autoservicehub.dto.ForgotPasswordRequest;
import com.autoservicehub.dto.LoginRequestDTO;
import com.autoservicehub.dto.LoginResponseDTO;
import com.autoservicehub.dto.ResetPasswordRequest;
import com.autoservicehub.dto.VerifyOtpRequest;
import com.autoservicehub.entity.User;
import com.autoservicehub.exception.InvalidRefreshTokenException;
import com.autoservicehub.repository.UserRepository;
import com.autoservicehub.security.JwtTokenProvider;
import com.autoservicehub.service.PasswordResetService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.*;

/**
 * Login and password reset authentication APIs.
 */
@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final PasswordResetService passwordResetService;
    private final UserRepository userRepository;

    @PostMapping("/login")
    public ApiResponse<LoginResponseDTO> login(
            @Valid @RequestBody LoginRequestDTO request) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );

        User user = userRepository.findByUsernameIgnoreCase(request.getUsername())
                .or(() -> userRepository.findByEmailIgnoreCase(request.getUsername()))
                .orElseThrow(() -> new IllegalStateException("Authenticated user not found: " + request.getUsername()));

        String roleName = user.getRole() != null ? user.getRole().getName() : null;
        if (roleName == null || roleName.isBlank()) {
            throw new IllegalStateException("Authenticated user has no assigned role: " + request.getUsername());
        }

        String srsRoleName = roleName.startsWith("ROLE_") ? roleName.substring(5) : roleName;
        if ("CUSTOMER".equalsIgnoreCase(srsRoleName)) {
            throw new AccessDeniedException("Customer sign-in is not available.");
        }

        String accessToken = jwtTokenProvider.generateAccessToken(
                user.getUsername(),
                srsRoleName
        );

        // Part of the token lifecycle required by SRS 9: the client holds the
        // refresh token so it can obtain a new access token once this one expires,
        // without re-sending the password.
        String refreshToken = jwtTokenProvider.generateRefreshToken(
                user.getUsername(),
                srsRoleName
        );

        return ApiResponse.ok(
                new LoginResponseDTO(accessToken, refreshToken, "Bearer",
                        user.getUsername(), srsRoleName, user.getFullName())
        );
    }

    @PostMapping("/forgot-password")
    public ApiResponse<String> forgotPassword(
            @Valid @RequestBody ForgotPasswordRequest request) {

        passwordResetService.sendOtp(request.getEmail());

        return ApiResponse.ok(
                "OTP sent successfully to your email"
        );
    }

    @PostMapping("/verify-otp")
    public ApiResponse<String> verifyOtp(
            @Valid @RequestBody VerifyOtpRequest request) {

        passwordResetService.verifyOtp(request);

        return ApiResponse.ok(
                "OTP verified successfully"
        );
    }

    @PostMapping("/reset-password")
    public ApiResponse<String> resetPassword(
            @Valid @RequestBody ResetPasswordRequest request) {

        passwordResetService.resetPassword(request);

        return ApiResponse.ok(
                "Password reset successfully"
        );
    }

    /**
     * Issues a new access token from a valid refresh token (SRS 9, token lifecycle).
     *
     * <p>The minimum behaviour the SRS calls for: validate the presented refresh
     * token and issue a fresh access token. The SRS specifies no rotation,
     * revocation list or reuse detection, so none is invented here.
     *
     * <p>The user is re-read rather than trusted from the token, so a deactivated
     * account cannot keep minting access tokens for the remainder of the refresh
     * token's lifetime, and a changed role takes effect on the next refresh.
     *
     * <p>Accepts the token as a raw request body. A JSON-quoted value is tolerated
     * because that is how the same token arrives when sent as a JSON string.
     */
    @PostMapping("/refresh")
    public ApiResponse<LoginResponseDTO> refresh(@RequestBody(required = false) String refreshToken) {

        String token = normaliseToken(refreshToken);
        if (token == null) {
            throw new InvalidRefreshTokenException();
        }
        if (!jwtTokenProvider.validateRefreshToken(token)) {
            // One message for every failure — expired, tampered, malformed, or an
            // access token presented in place of a refresh token. Distinguishing
            // them would tell an attacker which of their guesses were well-formed.
            throw new InvalidRefreshTokenException();
        }

        String username = jwtTokenProvider.getUsername(token);
        User user = userRepository.findByUsernameIgnoreCase(username)
                .orElseThrow(InvalidRefreshTokenException::new);

        if (!Boolean.TRUE.equals(user.getActive())) {
            throw new InvalidRefreshTokenException();
        }

        String roleName = user.getRole() != null ? user.getRole().getName() : null;
        if (roleName == null || roleName.isBlank()) {
            throw new InvalidRefreshTokenException();
        }
        String srsRoleName = roleName.startsWith("ROLE_") ? roleName.substring(5) : roleName;
        if ("CUSTOMER".equalsIgnoreCase(srsRoleName)) {
            throw new InvalidRefreshTokenException();
        }

        return ApiResponse.ok(new LoginResponseDTO(
                jwtTokenProvider.generateAccessToken(user.getUsername(), srsRoleName),
                jwtTokenProvider.generateRefreshToken(user.getUsername(), srsRoleName),
                "Bearer",
                user.getUsername(),
                srsRoleName,
                user.getFullName()));
    }

    /** Trims the raw body and removes a JSON string wrapper, if present. */
    private String normaliseToken(String raw) {
        if (raw == null) {
            return null;
        }
        String token = raw.trim();
        if (token.length() >= 2 && token.startsWith("\"") && token.endsWith("\"")) {
            token = token.substring(1, token.length() - 1).trim();
        }
        return token.isEmpty() ? null : token;
    }
}