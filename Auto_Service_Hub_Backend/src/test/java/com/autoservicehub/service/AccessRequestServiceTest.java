package com.autoservicehub.service;

import com.autoservicehub.dto.AccessRequestResponseDTO;
import com.autoservicehub.dto.CreateAccessRequestDTO;
import com.autoservicehub.dto.ReviewAccessRequestDTO;
import com.autoservicehub.entity.AccessRequest;
import com.autoservicehub.entity.Role;
import com.autoservicehub.entity.User;
import com.autoservicehub.exception.BusinessRuleException;
import com.autoservicehub.repository.AccessRequestRepository;
import com.autoservicehub.repository.RoleRepository;
import com.autoservicehub.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AccessRequestServiceTest {
    @Mock AccessRequestRepository requestRepository;
    @Mock UserRepository userRepository;
    @Mock RoleRepository roleRepository;
    @Mock PasswordEncoder passwordEncoder;
    @InjectMocks AccessRequestService service;

    @Test
    void storesNormalizedOwnerRequestWithoutCreatingAnAccount() {
        CreateAccessRequestDTO request = new CreateAccessRequestDTO();
        request.setName("Owner Applicant");
        request.setEmail(" OWNER@EXAMPLE.TEST ");
        request.setRequestedRole("owner");
        when(userRepository.findByEmailIgnoreCase("owner@example.test")).thenReturn(Optional.empty());
        when(requestRepository.existsByEmailIgnoreCaseAndStatus("owner@example.test", "PENDING")).thenReturn(false);
        when(requestRepository.save(any(AccessRequest.class))).thenAnswer(invocation -> invocation.getArgument(0));

        AccessRequestResponseDTO response = service.submit(request);

        ArgumentCaptor<AccessRequest> captor = ArgumentCaptor.forClass(AccessRequest.class);
        verify(requestRepository).save(captor.capture());
        assertThat(captor.getValue().getEmail()).isEqualTo("owner@example.test");
        assertThat(captor.getValue().getStatus()).isEqualTo("PENDING");
        assertThat(response.getRequestedRole()).isEqualTo("OWNER");
        verify(userRepository, never()).save(any());
    }

    @Test
    void refusesPublicAdminAccessRequest() {
        CreateAccessRequestDTO request = new CreateAccessRequestDTO();
        request.setName("Applicant");
        request.setEmail("admin@example.test");
        request.setRequestedRole("ADMIN");

        assertThatThrownBy(() -> service.submit(request))
                .isInstanceOf(BusinessRuleException.class)
                .hasMessageContaining("Only owner and staff");
        verifyNoInteractions(requestRepository, userRepository);
    }

    @Test
    void approvalCreatesAnActiveHashedAccountAndMarksRequestReviewed() {
        AccessRequest accessRequest = new AccessRequest();
        accessRequest.setId(5L);
        accessRequest.setName("Mechanic Applicant");
        accessRequest.setEmail("mechanic@example.test");
        accessRequest.setRequestedRole("MECHANIC");
        accessRequest.setStatus("PENDING");
        User reviewer = new User();
        reviewer.setUsername("admin");
        Role role = new Role();
        role.setName("MECHANIC");
        when(requestRepository.findById(5L)).thenReturn(Optional.of(accessRequest));
        when(userRepository.findByUsernameIgnoreCase("mechanic1")).thenReturn(Optional.empty());
        when(userRepository.findByEmailIgnoreCase("mechanic@example.test")).thenReturn(Optional.empty());
        when(userRepository.findByUsernameIgnoreCase("admin")).thenReturn(Optional.of(reviewer));
        when(roleRepository.findByNameIgnoreCase("MECHANIC")).thenReturn(Optional.of(role));
        when(passwordEncoder.encode("a-long-initial-password")).thenReturn("encoded-password");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(requestRepository.save(any(AccessRequest.class))).thenAnswer(invocation -> invocation.getArgument(0));

        ReviewAccessRequestDTO approval = new ReviewAccessRequestDTO();
        approval.setUsername("mechanic1");
        approval.setPassword("a-long-initial-password");
        approval.setRole("MECHANIC");

        AccessRequestResponseDTO result = service.approve(5L, approval, "admin");

        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(userCaptor.capture());
        assertThat(userCaptor.getValue().getPasswordHash()).isEqualTo("encoded-password");
        assertThat(userCaptor.getValue().getRole()).isSameAs(role);
        assertThat(userCaptor.getValue().getActive()).isTrue();
        assertThat(result.getStatus()).isEqualTo("APPROVED");
        assertThat(accessRequest.getReviewedBy()).isSameAs(reviewer);
    }
}
