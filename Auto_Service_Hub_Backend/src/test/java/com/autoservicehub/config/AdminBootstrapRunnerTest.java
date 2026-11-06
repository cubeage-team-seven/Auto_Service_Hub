package com.autoservicehub.config;

import com.autoservicehub.entity.Role;
import com.autoservicehub.entity.User;
import com.autoservicehub.repository.RoleRepository;
import com.autoservicehub.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.DefaultApplicationArguments;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AdminBootstrapRunnerTest {
    @Mock UserRepository userRepository;
    @Mock RoleRepository roleRepository;
    @Mock PasswordEncoder passwordEncoder;
    @InjectMocks AdminBootstrapRunner runner;

    @BeforeEach
    void configureBootstrap() {
        ReflectionTestUtils.setField(runner, "username", "first-admin");
        ReflectionTestUtils.setField(runner, "email", "admin@example.test");
        ReflectionTestUtils.setField(runner, "password", "a-very-long-bootstrap-secret");
        ReflectionTestUtils.setField(runner, "fullName", "First Administrator");
    }

    @Test
    void createsHashedAdminOnlyWhenNoAdminExists() throws Exception {
        when(userRepository.findAll()).thenReturn(List.of());
        when(userRepository.findByUsernameIgnoreCase("first-admin")).thenReturn(Optional.empty());
        when(userRepository.findByEmailIgnoreCase("admin@example.test")).thenReturn(Optional.empty());
        when(roleRepository.findByNameIgnoreCase("ADMIN")).thenReturn(Optional.empty());
        when(roleRepository.findByNameIgnoreCase("ROLE_ADMIN")).thenReturn(Optional.empty());
        when(roleRepository.save(any(Role.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(passwordEncoder.encode("a-very-long-bootstrap-secret")).thenReturn("bcrypt-hash");

        runner.run(new DefaultApplicationArguments(new String[0]));

        ArgumentCaptor<User> captor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(captor.capture());
        assertThat(captor.getValue().getUsername()).isEqualTo("first-admin");
        assertThat(captor.getValue().getEmail()).isEqualTo("admin@example.test");
        assertThat(captor.getValue().getPasswordHash()).isEqualTo("bcrypt-hash");
        assertThat(captor.getValue().getRole().getName()).isEqualTo("ADMIN");
        assertThat(captor.getValue().getActive()).isTrue();
    }

    @Test
    void skipsBootstrapWhenAnAdministratorAlreadyExists() throws Exception {
        Role role = new Role();
        role.setName("ROLE_ADMIN");
        User existingAdmin = new User();
        existingAdmin.setRole(role);
        when(userRepository.findAll()).thenReturn(List.of(existingAdmin));

        runner.run(new DefaultApplicationArguments(new String[0]));

        verify(userRepository, never()).save(any());
        verifyNoInteractions(passwordEncoder);
    }

    @Test
    void refusesPartiallyConfiguredBootstrap() {
        ReflectionTestUtils.setField(runner, "email", "");

        assertThatThrownBy(() -> runner.run(new DefaultApplicationArguments(new String[0])))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("must all be provided together");
        verifyNoInteractions(userRepository, roleRepository, passwordEncoder);
    }
}
