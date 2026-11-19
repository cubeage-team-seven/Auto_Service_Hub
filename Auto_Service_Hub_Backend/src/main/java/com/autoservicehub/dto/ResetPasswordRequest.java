package com.autoservicehub.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResetPasswordRequest {

    @NotBlank(message = "Email is required")
    @Email(message = "Please provide a valid email address")
    @Size(max = 150, message = "Email must not exceed 150 characters")
    private String email;

    @NotBlank(message = "Reset authorization is required")
    @Size(max = 100, message = "Reset authorization is invalid")
    private String resetToken;

    @NotBlank(message = "New password is required")
    @Size(min = 12, max = 72, message = "Password must be between 12 and 72 characters")
    @Pattern(
            regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z0-9\\s])[\\x21-\\x7E]+$",
            message = "Password must include uppercase and lowercase letters, a number, and a symbol")
    private String newPassword;

    @NotBlank(message = "Confirm password is required")
    @Size(min = 12, max = 72, message = "Password must be between 12 and 72 characters")
    private String confirmPassword;
}