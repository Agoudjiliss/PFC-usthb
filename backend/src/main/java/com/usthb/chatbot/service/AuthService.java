package com.usthb.chatbot.service;

import com.usthb.chatbot.dto.LoginRequest;
import com.usthb.chatbot.dto.LoginResponse;
import com.usthb.chatbot.dto.RegisterRequest;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final String jwtSecret = "your-secret-key-here-must-be-at-least-32-characters";
    private final long jwtExpiration = 86400000; // 24 heures

    public AuthService(AuthenticationManager authenticationManager) {
        this.authenticationManager = authenticationManager;
    }

    public LoginResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getIdentifier(), request.getPassword())
        );

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String token = generateToken(userDetails.getUsername());

        return new LoginResponse(token, userDetails.getUsername());
    }

    public LoginResponse register(RegisterRequest request) {
        // TODO: Implémenter la logique d'inscription
        // Pour le moment, nous utilisons la même logique que login
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setUsername(request.getUsername());
        loginRequest.setPassword(request.getPassword());
        return login(loginRequest);
    }

    private String generateToken(String username) {
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpiration))
                .signWith(SignatureAlgorithm.HS512, jwtSecret)
                .compact();
    }
} 