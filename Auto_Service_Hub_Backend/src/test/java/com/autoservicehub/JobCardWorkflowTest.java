package com.autoservicehub;

import com.autoservicehub.dto.JobCardRequestDTO;
import com.autoservicehub.entity.JobCard;
import com.autoservicehub.entity.Mechanic;
import com.autoservicehub.entity.User;
import com.autoservicehub.exception.BusinessRuleException;
import com.autoservicehub.repository.AppointmentRepository;
import com.autoservicehub.repository.AuditLogRepository;
import com.autoservicehub.repository.CustomerRepository;
import com.autoservicehub.repository.JobCardRepository;
import com.autoservicehub.repository.JobCardStatusHistoryRepository;
import com.autoservicehub.repository.MechanicRepository;
import com.autoservicehub.repository.MechanicSkillRepository;
import com.autoservicehub.repository.UserRepository;
import com.autoservicehub.repository.VehicleRepository;
import com.autoservicehub.service.MechanicAccessService;
import com.autoservicehub.service.ServiceAdvisorAccessService;
import com.autoservicehub.service.impl.JobCardServiceImpl;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class JobCardWorkflowTest {

    @Mock private JobCardRepository jobCardRepository;
    @Mock private CustomerRepository customerRepository;
    @Mock private VehicleRepository vehicleRepository;
    @Mock private MechanicRepository mechanicRepository;
    @Mock private AppointmentRepository appointmentRepository;
    @Mock private MechanicSkillRepository mechanicSkillRepository;
    @Mock private JobCardStatusHistoryRepository statusHistoryRepository;
    @Mock private AuditLogRepository auditLogRepository;
    @Mock private UserRepository userRepository;

    private JobCardServiceImpl service;

    @BeforeEach
    void setUp() {
        Mechanic mechanic = new Mechanic();
        mechanic.setId(1L);
        mechanic.setStatus("ACTIVE");
        User user = new User();
        user.setUsername("mechanic-a");
        user.setMechanic(mechanic);
        when(userRepository.findByUsernameIgnoreCase("mechanic-a")).thenReturn(Optional.of(user));
        SecurityContextHolder.getContext().setAuthentication(new UsernamePasswordAuthenticationToken(
                "mechanic-a", "not-used", List.of(new SimpleGrantedAuthority("ROLE_MECHANIC"))));
        service = new JobCardServiceImpl(jobCardRepository, customerRepository, vehicleRepository,
                mechanicRepository, appointmentRepository, mechanicSkillRepository, statusHistoryRepository,
                auditLogRepository, new MechanicAccessService(userRepository), new ServiceAdvisorAccessService(userRepository));
    }

    @AfterEach
    void clearSecurityContext() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void rejectsSkippingJobCardWorkflowStages() {
        Mechanic mechanic = new Mechanic();
        mechanic.setId(1L);
        JobCard jobCard = new JobCard();
        jobCard.setId(55L);
        jobCard.setStatus("RECEIVED");
        jobCard.setMechanic(mechanic);
        jobCard.setAssignedMechanics(Set.of(mechanic));
        when(jobCardRepository.findById(55L)).thenReturn(Optional.of(jobCard));

        JobCardRequestDTO request = new JobCardRequestDTO();
        request.setStatus("DELIVERED");

        assertThrows(BusinessRuleException.class, () -> service.update(55L, request));
        verify(jobCardRepository, never()).save(org.mockito.ArgumentMatchers.any(JobCard.class));
    }

    @Test
    void acceptsSrsRepairStartedAliasWithoutRewritingItsPersistedLabel() {
        Mechanic mechanic = new Mechanic();
        mechanic.setId(1L);
        JobCard jobCard = new JobCard();
        jobCard.setId(56L);
        jobCard.setStatus("INSPECTION");
        jobCard.setMechanic(mechanic);
        jobCard.setAssignedMechanics(Set.of(mechanic));
        when(jobCardRepository.findById(56L)).thenReturn(Optional.of(jobCard));
        when(jobCardRepository.save(org.mockito.ArgumentMatchers.any(JobCard.class)))
            .thenAnswer(invocation -> invocation.getArgument(0));

        JobCardRequestDTO request = new JobCardRequestDTO();
        request.setStatus("REPAIR_STARTED");

        var response = service.update(56L, request);

        org.junit.jupiter.api.Assertions.assertEquals("REPAIR_STARTED", response.getStatus());
        org.junit.jupiter.api.Assertions.assertNotNull(response.getStartedDate());
    }
}