package com.autoservicehub.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateManagedUserDTO {
    @NotBlank
    @Size(min = 3, max = 100)
    @Pattern(regexp = "^[A-Za-z0-9._@+-]+$")
    private String username;

    @Size(max = 150)
    private String fullName;

    @NotBlank
    @Email
    @Size(max = 150)
    private String email;

    @NotBlank
    @Size(min = 12, max = 72)
    private String password;

    @NotBlank
    private String role;

    @Size(max = 30)
    private String phone;

}
