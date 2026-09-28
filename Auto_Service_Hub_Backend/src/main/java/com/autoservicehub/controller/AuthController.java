package com.autoservicehub.controller;

import com.autoservicehub.dto.ApiResponse;
import com.autoservicehub.dto.ForgotPasswordRequest;
import com.autoservicehub.dto.LoginRequestDTO;
import com.autoservicehub.dto.LoginResponseDTO;
import com.autoservicehub.dto.ResetPasswordRequest;
import com.autoservicehub.dto.VerifyOtpRequest;
import com.autoservicehub.entity.User;
import com.autoservicehub.repository.UserRepository;
import com.autoservicehub.security.JwtTokenProvider;
import com.autoservicehub.service.PasswordResetService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
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

        String accessToken = jwtTokenProvider.generateAccessToken(
                user.getUsername(),
                srsRoleName
        );

        return ApiResponse.ok(
                new LoginResponseDTO(accessToken, null, "Bearer")
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

    @PostMapping("/refresh")
    public ApiResponse<LoginResponseDTO> refresh(
            @RequestBody String refreshToken) {

        // TODO: validate refresh token and issue a new access token
        throw new UnsupportedOperationException(
                "Refresh token flow to be implemented"
        );
    }
}