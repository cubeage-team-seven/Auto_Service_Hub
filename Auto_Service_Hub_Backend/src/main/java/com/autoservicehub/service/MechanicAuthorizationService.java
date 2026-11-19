package com.autoservicehub.service;

import com.autoservicehub.entity.JobCard;
import com.autoservicehub.entity.JobTask;
import com.autoservicehub.entity.Mechanic;
import com.autoservicehub.entity.User;
import com.autoservicehub.repository.MechanicRepository;
import com.autoservicehub.repository.JobTaskRepository;
import com.autoservicehub.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class MechanicAuthorizationService {

    private final UserRepository userRepository;
    private final MechanicRepository mechanicRepository;
    private final JobTaskRepository jobTaskRepository;

    public boolean isMechanic() {
        return isMechanicPrincipal();
    }

    public static boolean isMechanicPrincipal() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication != null && authentication.getAuthorities().stream()
                .anyMatch(authority -> "ROLE_MECHANIC".equals(authority.getAuthority()));
    }

    public static void assertNotMechanic(String message) {
        if (isMechanicPrincipal()) {
            throw new AccessDeniedException(message);
        }
    }

    @Transactional(readOnly = true)
    public Mechanic requireCurrentMechanic() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || !isMechanic()) {
            throw new AccessDeniedException("A mechanic account is required.");
        }

        User user = userRepository.findByUsernameIgnoreCase(authentication.getName())
                .orElseThrow(() -> new AccessDeniedException("The signed-in mechanic account is unavailable."));
        return mechanicRepository.findByUser_Id(user.getId())
                .orElseThrow(() -> new AccessDeniedException(
                        "This mechanic account is not linked to a mechanic profile."));
    }

    public void assertJobCardAssigned(JobCard jobCard) {
        if (!isMechanic()) {
            return;
        }
        Mechanic mechanic = requireCurrentMechanic();
        boolean assignedAsLead = jobCard != null && jobCard.getMechanic() != null
                && mechanic.getId().equals(jobCard.getMechanic().getId());
        boolean assignedToTask = jobCard != null
                && jobTaskRepository.existsByJobCardIdAndMechanicId(jobCard.getId(), mechanic.getId());
        if (!assignedAsLead && !assignedToTask) {
            throw new AccessDeniedException("This job card is not assigned to the signed-in mechanic.");
        }
    }

    public void assertTaskAssigned(JobTask task) {
        assertJobCardAssigned(task == null ? null : task.getJobCard());
    }

    public void assertOwnerOrManager() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        boolean allowed = authentication != null && authentication.getAuthorities().stream()
                .anyMatch(authority -> "ROLE_OWNER".equals(authority.getAuthority())
                        || "ROLE_MANAGER".equals(authority.getAuthority()));
        if (!allowed) {
            throw new AccessDeniedException("Only an owner or manager may link mechanic accounts.");
        }
    }
}
