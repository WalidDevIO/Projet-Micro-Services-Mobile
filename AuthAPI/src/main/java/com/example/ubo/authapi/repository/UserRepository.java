package com.example.ubo.authapi.repository;

import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Component;

import com.example.ubo.authapi.dto.UserRepositoryDto;

import java.util.HashMap;
import java.util.Map;

@Component
public class UserRepository {

    private final NamedParameterJdbcTemplate jdbcTemplate;

    public UserRepository(NamedParameterJdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final static String SQL_INSERT_ACCOUNT = "INSERT INTO account (EMAIL, USERNAME, PASSWORD, FIRSTNAME, LASTNAME)" +
            " VALUES (:email, :username, :password, :firstname, :lastname);";

    private final static String SQL_SELECT_ACCOUNT = "SELECT * FROM account WHERE username = :username;";

    public UserRepositoryDto addUser(UserRepositoryDto user) {
        Map<String, Object> params = new HashMap<>();
        params.put("email", user.getEmail());
        params.put("username", user.getUsername());
        params.put("password", user.getPassword());
        params.put("lastname", user.getLastName());
        params.put("firstname", user.getFirstName());
        jdbcTemplate.update(SQL_INSERT_ACCOUNT, params);
        return user;
    }

    public UserRepositoryDto getAccountByUsername(String username) {
        Map<String, Object> params = new HashMap<>();
        params.put("username", username);
        try {
            return jdbcTemplate.queryForObject(SQL_SELECT_ACCOUNT, params, (r, s) -> {
                UserRepositoryDto user = new UserRepositoryDto();
                user.setEmail(r.getString("EMAIL"));
                user.setUsername(r.getString("USERNAME"));
                user.setPassword(r.getString("PASSWORD"));
                user.setLastName(r.getString("LASTNAME"));
                user.setFirstName(r.getString("FIRSTNAME"));
                return user;
            });
        } catch (Exception e) {
            return null;
        }
    }
}