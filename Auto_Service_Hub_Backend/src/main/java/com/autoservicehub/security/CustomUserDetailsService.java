package com.autoservicehub.security;

import com.autoservicehub.entity.User;
import com.autoservicehub.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
<<<<<<< HEAD
    public UserDetails loadUserByUsername(String usernameOrEmail) {

        User user = userRepository.findByUsernameIgnoreCase(usernameOrEmail)
                .orElseGet(() -> userRepository.findByEmailIgnoreCase(usernameOrEmail)
                        .orElseThrow(() ->
                                new UsernameNotFoundException(
                                        "User not found: " + usernameOrEmail
                                )));
=======
    public UserDetails loadUserByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
>>>>>>> origin/development

        return org.springframework.security.core.userdetails.User
                .withUsername(user.getUsername())
                .password(user.getPasswordHash())
<<<<<<< HEAD
                .authorities(List.of(
                        new SimpleGrantedAuthority("ROLE_USER")
                ))
=======
                .authorities(List.of(new SimpleGrantedAuthority("ROLE_USER")))
>>>>>>> origin/development
                .disabled(Boolean.FALSE.equals(user.getActive()))
                .build();
    }
}