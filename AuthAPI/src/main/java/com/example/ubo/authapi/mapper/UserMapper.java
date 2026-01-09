package com.example.ubo.authapi.mapper;

import com.example.ubo.authapi.dto.UserRepositoryDto;
import com.example.ubo.authapi.entity.UserEntity;

import dto.authapi.User;

public class UserMapper {

    public static UserEntity toEntity(User dto) {
        if (dto == null)
            return null;
        UserEntity entity = new UserEntity();
        entity.setUsername(dto.getUsername());
        entity.setEmail(dto.getEmail());
        entity.setLastName(dto.getLastName());
        entity.setFirstName(dto.getFirstName());
        return entity;
    }

    public static User toDto(UserEntity entity) {
        if (entity == null)
            return null;
        User dto = new User();
        dto.setUsername(entity.getUsername());
        dto.setEmail(entity.getEmail());
        dto.setLastName(entity.getLastName());
        dto.setFirstName(entity.getFirstName());
        return dto;
    }

    public static UserRepositoryDto toRepositoryDto(UserEntity entity) {
        if (entity == null)
            return null;
        UserRepositoryDto dto = new UserRepositoryDto();
        dto.setUsername(entity.getUsername());
        dto.setEmail(entity.getEmail());
        dto.setPassword(entity.getPassword());
        dto.setLastName(entity.getLastName());
        dto.setFirstName(entity.getFirstName());
        return dto;
    }

    public static UserEntity toEntity(UserRepositoryDto dto) {
        if (dto == null)
            return null;
        UserEntity entity = new UserEntity();
        entity.setUsername(dto.getUsername());
        entity.setEmail(dto.getEmail());
        entity.setPassword(dto.getPassword());
        entity.setFirstName(dto.getFirstName());
        entity.setLastName(dto.getLastName());
        return entity;
    }
    
}
