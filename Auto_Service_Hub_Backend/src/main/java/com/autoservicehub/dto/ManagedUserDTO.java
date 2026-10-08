package com.autoservicehub.dto;

import com.autoservicehub.entity.User;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ManagedUserDTO {
    private Long id;
    private String username;
    private String email;
    private String role;
    private boolean active;

    public static ManagedUserDTO from(User user) {
        ManagedUserDTO dto = new ManagedUserDTO();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole().getName());
        dto.setActive(Boolean.TRUE.equals(user.getActive()));
        return dto;
    }
}
