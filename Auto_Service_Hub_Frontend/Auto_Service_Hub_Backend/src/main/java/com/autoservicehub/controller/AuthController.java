package com.autoservicehub.controller;

import com.autoservicehub.dto.ApiResponse;
import com.autoservicehub.dto.LoginRequestDTO;
import com.autoservicehub.dto.LoginResponseDTO;
import com.autoservicehub.security.JwtTokenProvider;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

/**
 * Login and token lifecycle (SRS 9 - Authentication API group).
 */
@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;

    @PostMapping("/login")
    public ApiResponse<LoginResponseDTO> login(@Valid @RequestBody LoginRequestDTO request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));

        String accessToken = jwtTokenProvider.generateAccessToken(request.getUsername(), "USER");
        return ApiResponse.ok(new LoginResponseDTO(accessToken, null, "Bearer"));
    }

    @PostMapping("/refresh")
    public ApiResponse<LoginResponseDTO> refresh(@RequestBody String refreshToken) {
        // TODO: validate refresh token and issue a new access token
        throw new UnsupportedOperationException("Refresh token flow to be implemented");
    }
}
