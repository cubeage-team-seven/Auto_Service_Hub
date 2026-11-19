package com.autoservicehub.service;

import com.autoservicehub.entity.Mechanic;
import com.autoservicehub.entity.User;
import com.autoservicehub.exception.BusinessRuleException;
import com.autoservicehub.exception.ResourceNotFoundException;
import com.autoservicehub.repository.MechanicRepository;
import com.autoservicehub.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Locale;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class MechanicAccountAssociationService {

    private final MechanicRepository mechanicRepository;
    private final UserRepository userRepository;

    @Transactional
    public Mechanic associate(Long mechanicId, Long userId) {
        assertAssociationRole();
        if (userId == null) {
            throw new BusinessRuleException("A saved MECHANIC account is required.");
        }

        User lockedUser = userRepository.findByIdForMechanicAssociation(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));
        String roleName = lockedUser.getRole() == null ? "" : lockedUser.getRole().getName();
        String normalizedRole = roleName.trim().toUpperCase(Locale.ROOT);
        if (normalizedRole.startsWith("ROLE_")) {
            normalizedRole = normalizedRole.substring(5);
        }
        if (!"MECHANIC".equals(normalizedRole)) {
            throw new BusinessRuleException("Only a MECHANIC user account can be linked to a mechanic profile.");
        }

        Mechanic mechanic = mechanicRepository.findByIdForAssociation(mechanicId)
                .orElseThrow(() -> new ResourceNotFoundException("Mechanic not found: " + mechanicId));
        Mechanic existingLink = mechanicRepository
                .findByUser_IdForAssociation(lockedUser.getId())
                .orElse(null);
        if (existingLink != null && !mechanicId.equals(existingLink.getId())) {
            throw new BusinessRuleException("This user account is already linked to another mechanic profile.");
        }
        if (mechanic.getUser() != null && !lockedUser.getId().equals(mechanic.getUser().getId())) {
            throw new BusinessRuleException(
                    "This mechanic profile is already linked to another user account. Unlink it first.");
        }

        mechanic.setUser(lockedUser);
        return mechanicRepository.save(mechanic);
    }

    @Transactional(readOnly = true)
    public Optional<Mechanic> findProfileForUser(Long userId) {
        return mechanicRepository.findByUser_Id(userId);
    }

    @Transactional
    public void unlinkUser(Long userId) {
        assertAssociationRole();
        mechanicRepository.findByUser_Id(userId)
                .flatMap(existing -> mechanicRepository.findByIdForAssociation(existing.getId()))
                .ifPresent(mechanic -> {
            mechanic.setUser(null);
            mechanicRepository.save(mechanic);
        });
    }

    private void assertAssociationRole() {
        boolean allowed = SecurityContextHolder.getContext().getAuthentication() != null
                && SecurityContextHolder.getContext().getAuthentication().getAuthorities().stream()
                .anyMatch(authority -> "ROLE_OWNER".equals(authority.getAuthority())
                        || "ROLE_MANAGER".equals(authority.getAuthority())
                        || "ROLE_ADMIN".equals(authority.getAuthority()));
        if (!allowed) {
            throw new AccessDeniedException("Only an owner, manager, or administrator may link mechanic accounts.");
        }
    }
}
