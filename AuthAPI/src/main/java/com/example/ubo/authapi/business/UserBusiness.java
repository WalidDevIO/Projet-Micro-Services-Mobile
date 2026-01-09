package com.example.ubo.authapi.business;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.example.ubo.authapi.configuration.Jwt;
import com.example.ubo.authapi.entity.UserEntity;
import com.example.ubo.authapi.repository.UserRepository;

import dto.authapi.CheckResponse;
import dto.authapi.LoginRequest;
import dto.authapi.LoginResponse;
import dto.authapi.LogoutResponse;
import dto.authapi.RegisterRequest;
import dto.authapi.RegisterResponse;
import dto.authapi.User;
import jakarta.inject.Inject;

import static com.example.ubo.authapi.mapper.UserMapper.toEntity;
import static com.example.ubo.authapi.mapper.UserMapper.toRepositoryDto;

@Component
public class UserBusiness {
    
    @Inject
    private PasswordEncoder passwordEncoder;

    @Inject
    private UserRepository userRepository;

    @Inject
    private Jwt jwtUtil;

    private String encodePassword(String rawPassword) {
        return passwordEncoder.encode(rawPassword);
    }

    private boolean matchesPassword(String rawPassword, String encodedPassword) {
        return passwordEncoder.matches(rawPassword, encodedPassword);
    }

    public LoginResponse login(LoginRequest loginRequest) {
        UserEntity userEntity = toEntity(userRepository.getAccountByUsername(loginRequest.getUsername()));
        LoginResponse response = new LoginResponse();
        if (userEntity != null && matchesPassword(loginRequest.getPassword(), userEntity.getPassword())) {
            response.setSuccess(true);
            response.setToken(jwtUtil.generateToken(userEntity.getUsername()));
            response.setUser(new dto.authapi.User()
                    .username(userEntity.getUsername())
                    .email(userEntity.getEmail())
                    .firstName(userEntity.getFirstName())
                    .lastName(userEntity.getLastName())
            );
        } else {
            response.setSuccess(false);
        }
        return response;
    }

    public RegisterResponse register(RegisterRequest registerRequest) {
        UserEntity userEntity = toEntity(userRepository.getAccountByUsername(registerRequest.getUsername()));
        RegisterResponse response = new RegisterResponse();
        if (userEntity == null) {
            UserEntity newUser = new UserEntity();
            newUser.setUsername(registerRequest.getUsername());
            newUser.setEmail(registerRequest.getEmail());
            newUser.setPassword(encodePassword(registerRequest.getPassword()));
            newUser.setLastName(registerRequest.getLastName());
            newUser.setFirstName(registerRequest.getFirstName());
            userRepository.addUser(toRepositoryDto(newUser));
            response.setSuccess(true);
            response.setMessage("User registered successfully");
            response.setUser(new User()
                    .username(newUser.getUsername())
                    .email(newUser.getEmail())
                    .lastName(newUser.getLastName())
                    .firstName(newUser.getFirstName())
            );
        } else {
            response.setSuccess(false);
            response.setMessage("Username already exists");
        }
        return response;
    }

    public LogoutResponse logout(String token) {
        jwtUtil.invalidateToken(token);
        LogoutResponse response = new LogoutResponse();
        response.setSuccess(true);
        response.setMessage("User logged out successfully");
        return response;
    }

    public CheckResponse check(String token) {
        CheckResponse response = new CheckResponse();
        if (jwtUtil.validateToken(token)) {
            response.setValid(true);
            response.setUsername(jwtUtil.getUsername(token));
        } else {
            response.setValid(false);
        }
        return response;
    }

}
