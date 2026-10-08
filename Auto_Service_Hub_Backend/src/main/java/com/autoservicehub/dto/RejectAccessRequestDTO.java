package com.autoservicehub.dto;

import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RejectAccessRequestDTO {
    @Size(max = 1000)
    private String note;
}
