package com.autoservicehub.config;

import com.autoservicehub.entity.Role;
import com.autoservicehub.entity.User;
import com.autoservicehub.repository.RoleRepository;
import com.autoservicehub.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Locale;

@Component
@RequiredArgsConstructor
public class AdminBootstrapRunner implements ApplicationRunner {
    private static final Logger log = LoggerFactory.getLogger(AdminBootstrapRunner.class);

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.bootstrap-admin.username:}")
    private String username;

    @Value("${app.bootstrap-admin.email:}")
    private String email;

    @Value("${app.bootstrap-admin.password:}")
    private String password;

    @Value("${app.bootstrap-admin.full-name:}")
    private String fullName;

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        boolean configured = hasValue(username) || hasValue(email) || hasValue(password);
        if (!configured) {
            return;
        }
        if (!hasValue(username) || !hasValue(email) || !hasValue(password)) {
            throw new IllegalStateException(
                    "ADMIN_BOOTSTRAP_USERNAME, ADMIN_BOOTSTRAP_EMAIL, and ADMIN_BOOTSTRAP_PASSWORD must all be provided together.");
        }
        if (password.length() < 16) {
            throw new IllegalStateException("ADMIN_BOOTSTRAP_PASSWORD must contain at least 16 characters.");
        }
        if (userRepository.findAll().stream().anyMatch(user -> user.getRole() != null
                && user.getRole().getName() != null
                && user.getRole().getName().replace("ROLE_", "").equalsIgnoreCase("ADMIN"))) {
            log.info("Administrator account already exists; initial administrator bootstrap was skipped.");
            return;
        }

        String normalizedUsername = username.trim().toLowerCase(Locale.ROOT);
        String normalizedEmail = email.trim().toLowerCase(Locale.ROOT);
        if (userRepository.findByUsernameIgnoreCase(normalizedUsername).isPresent()
                || userRepository.findByEmailIgnoreCase(normalizedEmail).isPresent()) {
            throw new IllegalStateException("Configured initial administrator username or email is already in use.");
        }
        Role role = roleRepository.findByNameIgnoreCase("ADMIN")
                .or(() -> roleRepository.findByNameIgnoreCase("ROLE_ADMIN"))
                .orElseGet(() -> {
                    Role adminRole = new Role();
                    adminRole.setName("ADMIN");
                    adminRole.setDescription("System administrator");
                    return roleRepository.save(adminRole);
                });

        User admin = new User();
        admin.setUsername(normalizedUsername);
        admin.setEmail(normalizedEmail);
        admin.setPasswordHash(passwordEncoder.encode(password));
        admin.setFullName(hasValue(fullName) ? fullName.trim() : normalizedUsername);
        admin.setActive(true);
        admin.setRole(role);
        userRepository.save(admin);
        log.info("Initial administrator account created from protected deployment configuration.");
    }

    private boolean hasValue(String value) {
        return value != null && !value.isBlank();
    }
}
