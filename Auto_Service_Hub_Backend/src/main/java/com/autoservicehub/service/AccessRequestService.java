package com.autoservicehub.service;

import com.autoservicehub.dto.AccessRequestResponseDTO;
import com.autoservicehub.dto.CreateAccessRequestDTO;
import com.autoservicehub.dto.CreateManagedUserDTO;
import com.autoservicehub.dto.RejectAccessRequestDTO;
import com.autoservicehub.dto.ReviewAccessRequestDTO;
import com.autoservicehub.entity.AccessRequest;
import com.autoservicehub.entity.Role;
import com.autoservicehub.entity.User;
import com.autoservicehub.exception.BusinessRuleException;
import com.autoservicehub.exception.ResourceNotFoundException;
import com.autoservicehub.repository.AccessRequestRepository;
import com.autoservicehub.repository.RoleRepository;
import com.autoservicehub.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class AccessRequestService {
    private static final Set<String> REQUESTABLE_ROLES = Set.of(
            "OWNER", "MANAGER", "SERVICE_ADVISOR", "MECHANIC", "INVENTORY_MANAGER", "BILLING_USER");
    private static final Set<String> ASSIGNABLE_ROLES = Set.of(
            "OWNER", "MANAGER", "SERVICE_ADVISOR", "MECHANIC", "INVENTORY_MANAGER", "BILLING_USER");

    private final AccessRequestRepository requestRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public AccessRequestResponseDTO submit(CreateAccessRequestDTO dto) {
        String email = dto.getEmail().trim().toLowerCase(Locale.ROOT);
        String role = normalizeRole(dto.getRequestedRole());
        if (!REQUESTABLE_ROLES.contains(role)) {
            throw new BusinessRuleException("Only owner and staff access requests are allowed.");
        }
        if (userRepository.findByEmailIgnoreCase(email).isPresent()) {
            throw new BusinessRuleException("An account already exists for this email address.");
        }
        if (requestRepository.existsByEmailIgnoreCaseAndStatus(email, "PENDING")) {
            throw new BusinessRuleException("An access request for this email is already awaiting review.");
        }

        AccessRequest request = new AccessRequest();
        request.setName(dto.getName().trim());
        request.setEmail(email);
        request.setPhone(dto.getPhone() == null ? null : dto.getPhone().trim());
        request.setRequestedRole(role);
        request.setMessage(dto.getMessage() == null ? null : dto.getMessage().trim());
        request.setStatus("PENDING");
        return AccessRequestResponseDTO.from(requestRepository.save(request));
    }

    @Transactional(readOnly = true)
    public List<AccessRequestResponseDTO> list() {
        return requestRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(AccessRequestResponseDTO::from)
                .toList();
    }

    @Transactional
    public AccessRequestResponseDTO approve(Long id, ReviewAccessRequestDTO dto, String reviewerName) {
        AccessRequest request = getPendingRequest(id);
        String approvedRole = normalizeRole(dto.getRole());
        if (!ASSIGNABLE_ROLES.contains(approvedRole) || !approvedRole.equals(request.getRequestedRole())) {
            throw new BusinessRuleException("The approved role must match the requested owner or staff role.");
        }
        createUser(request.getName(), request.getEmail(), request.getPhone(),
                dto.getUsername(), dto.getPassword(), approvedRole);
        review(request, reviewerName, "APPROVED", "Approved");
        return AccessRequestResponseDTO.from(requestRepository.save(request));
    }

    @Transactional
    public AccessRequestResponseDTO reject(Long id, RejectAccessRequestDTO dto, String reviewerName) {
        AccessRequest request = getPendingRequest(id);
        String note = dto.getNote() == null || dto.getNote().isBlank() ? "Rejected" : dto.getNote().trim();
        review(request, reviewerName, "REJECTED", note);
        return AccessRequestResponseDTO.from(requestRepository.save(request));
    }

    @Transactional
    public void createManagedUser(CreateManagedUserDTO dto) {
        String role = normalizeRole(dto.getRole());
        if (!ASSIGNABLE_ROLES.contains(role)) {
            throw new BusinessRuleException("Only owner and staff accounts can be created here.");
        }
        createUser(dto.getFullName(), dto.getEmail().trim().toLowerCase(Locale.ROOT), dto.getPhone(),
                dto.getUsername(), dto.getPassword(), role);
    }

    private void createUser(String fullName, String email, String phone,
                            String usernameInput, String rawPassword, String roleName) {
        String username = usernameInput.trim().toLowerCase(Locale.ROOT);
        if (userRepository.findByUsernameIgnoreCase(username).isPresent()) {
            throw new BusinessRuleException("This username is already in use.");
        }
        if (userRepository.findByEmailIgnoreCase(email).isPresent()) {
            throw new BusinessRuleException("A login account already exists for this email address.");
        }
        Role role = roleRepository.findByNameIgnoreCase(roleName)
                .or(() -> roleRepository.findByNameIgnoreCase("ROLE_" + roleName))
                .orElseThrow(() -> new BusinessRuleException("The requested account role is not configured."));

        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(rawPassword));
        user.setFullName(fullName);
        user.setPhone(phone);
        user.setRole(role);
        user.setActive(true);
        userRepository.save(user);
    }

    private AccessRequest getPendingRequest(Long id) {
        AccessRequest request = requestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Access request not found: " + id));
        if (!"PENDING".equals(request.getStatus())) {
            throw new BusinessRuleException("This access request has already been reviewed.");
        }
        return request;
    }

    private void review(AccessRequest request, String reviewerName, String status, String note) {
        User reviewer = userRepository.findByUsernameIgnoreCase(reviewerName)
                .orElseThrow(() -> new ResourceNotFoundException("Administrator account not found."));
        request.setStatus(status);
        request.setReviewedBy(reviewer);
        request.setReviewedAt(LocalDateTime.now());
        request.setReviewNote(note);
    }

    private String normalizeRole(String role) {
        return role == null ? "" : role.trim().toUpperCase(Locale.ROOT).replaceFirst("^ROLE_", "");
    }
}
