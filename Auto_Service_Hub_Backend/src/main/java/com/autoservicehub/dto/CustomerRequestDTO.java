package com.autoservicehub.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CustomerRequestDTO {
    @NotBlank
    private String name;
    @NotBlank
    private String phone;
    @Email
    private String email;
    private String address;
    private String status;
}
