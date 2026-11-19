package com.autoservicehub.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

/**
 * Inbound payload for updating a user account (SRS 8.2 High-Level Entities;
 * SRS 13 Roles &amp; Permissions).
 *
 * <p>The fields are the ones the user-management screen can pre-fill and that the
 * update endpoint accepts: the profile fields, the role and the account status.
 * {@code status} is optional and, like {@link UserRequestDTO}, defaults to
 * {@code Active} when omitted.
 *
 * <p>There is deliberately <b>no {@code password} field</b>. {@code password_hash}
 * is never echoed by any response ({@link UserResponseDTO} carries no credential),
 * so the edit form has nothing to pre-fill and sending one here would only reset a
 * credential the caller cannot see. An update therefore preserves the existing
 * hash; password changes are a separate concern.
 *
 * <p>{@code role} is intentionally not whitelisted with a regex: the authoritative
 * role names live in the {@code roles} table, and the service resolves the
 * supplied name against that table exactly as it does on create.
 */
@Getter
@Setter
public class UserUpdateDTO {

    @NotBlank(message = "fullName is required")
    @Size(max = 100, message = "fullName must not exceed 100 characters")
    private String fullName;

    @NotBlank(message = "username is required")
    @Size(min = 3, max = 50, message = "username must be between 3 and 50 characters")
    private String username;

    @NotBlank(message = "email is required")
    @Email(message = "Please provide a valid email address")
    @Size(max = 150, message = "email must not exceed 150 characters")
    private String email;

    @NotBlank(message = "phone is required")
    @Size(max = 30, message = "phone must not exceed 30 characters")
    private String phone;

    /** Role name as stored in the {@code roles} table, e.g. {@code SERVICE_ADVISOR}. */
    @NotBlank(message = "role is required")
    @Size(max = 50, message = "role must not exceed 50 characters")
    private String role;

    /** Active or Inactive. Defaults to {@code Active} on update when omitted. */
    @Pattern(
            regexp = "(?i)^(Active|Inactive)$",
            message = "status must be Active or Inactive")
    private String status;

    /** Required when changing an unlinked account to MECHANIC; explicitly selected by the owner. */
    private Long mechanicId;
}
