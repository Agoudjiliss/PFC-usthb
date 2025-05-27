package com.usthb.chatbot.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.Collections;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final PasswordEncoder passwordEncoder;

    @Autowired
    public CustomUserDetailsService(@Lazy PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        if ("admin".equals(username)) {
            return new User(
                "admin",
                passwordEncoder.encode("admin"),
                Collections.singleton(new SimpleGrantedAuthority("ROLE_ADMIN"))
            );
        } else if ("user".equals(username)) {
            return new User(
                "user",
                passwordEncoder.encode("user"),
                Collections.singleton(new SimpleGrantedAuthority("ROLE_USER"))
            );
        }
        throw new UsernameNotFoundException("User not found with username: " + username);
    }
} 