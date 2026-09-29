package com.autoservicehub;

import com.autoservicehub.entity.Notification;
import com.autoservicehub.entity.User;
import com.autoservicehub.exception.ResourceNotFoundException;
import com.autoservicehub.repository.NotificationRepository;
import com.autoservicehub.repository.UserRepository;
import com.autoservicehub.service.EmailService;
import com.autoservicehub.service.impl.NotificationServiceImpl;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class NotificationServiceTest {

    @AfterEach
    void clearSecurityContext() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void persistsInAppNotificationForSpecifiedUser() {
        NotificationRepository notifications = mock(NotificationRepository.class);
        UserRepository users = mock(UserRepository.class);
        User recipient = new User();
        recipient.setId(12L);
        when(users.findById(12L)).thenReturn(Optional.of(recipient));
        when(notifications.save(any(Notification.class))).thenAnswer(invocation -> invocation.getArgument(0));
        NotificationServiceImpl service = new NotificationServiceImpl(notifications, users, mock(EmailService.class));

        service.sendInApp(12L, "Appointment", "Your appointment was scheduled.");

        verify(notifications).save(org.mockito.ArgumentMatchers.argThat(notification ->
                notification.getRecipient().getId().equals(12L)
                        && "IN_APP".equals(notification.getChannel())
                        && Boolean.FALSE.equals(notification.getRead())));
    }

    @Test
    void advisorCannotMarkAnotherUsersNotificationRead() {
        NotificationRepository notifications = mock(NotificationRepository.class);
        UserRepository users = mock(UserRepository.class);
        User advisor = new User();
        advisor.setId(20L);
        advisor.setUsername("advisor");
        when(users.findByUsernameIgnoreCase("advisor")).thenReturn(Optional.of(advisor));
        when(notifications.findByIdAndRecipientId(55L, 20L)).thenReturn(Optional.empty());
        SecurityContextHolder.getContext().setAuthentication(new UsernamePasswordAuthenticationToken(
                "advisor", "not-used", List.of(new SimpleGrantedAuthority("ROLE_SERVICE_ADVISOR"))));
        NotificationServiceImpl service = new NotificationServiceImpl(notifications, users, mock(EmailService.class));

        assertThrows(ResourceNotFoundException.class, () -> service.markMineRead(55L));
        verify(notifications, never()).save(any(Notification.class));
    }
}