package com.autoservicehub.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginResponseDTO {
    private String accessToken;
    private String refreshToken;
    private String tokenType;
    private String username;
    private String role;
    private String fullName;

    public LoginResponseDTO(String accessToken, String refreshToken, String tokenType) {
        this(accessToken, refreshToken, tokenType, null, null, null);
    }

    public LoginResponseDTO(String accessToken, String refreshToken, String tokenType,
                            String username, String role, String fullName) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.tokenType = tokenType;
        this.username = username;
        this.role = role;
        this.fullName = fullName;
    }
}
