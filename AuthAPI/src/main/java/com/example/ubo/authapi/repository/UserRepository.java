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

    private final static String SQL_INSERT_ACCOUNT = "INSERT INTO ACCOUNT (EMAIL, USERNAME, PASSWORD, FIRSTNAME, LASTNAME, ADMIN)" +
            " VALUES (:email, :username, :password, :firstname, :lastname, :admin);";

    private final static String SQL_SELECT_ACCOUNT_BY_UNAME = "SELECT * FROM ACCOUNT WHERE USERNAME = :username;";

    private final static String SQL_SELECT_ACCOUNT_BY_MAIL = "SELECT * FROM ACCOUNT WHERE EMAIL = :email;";

    public UserRepositoryDto addUser(UserRepositoryDto user) {
        Map<String, Object> params = new HashMap<>();
        params.put("email", user.getEmail());
        params.put("username", user.getUsername());
        params.put("password", user.getPassword());
        params.put("lastname", user.getLastName());
        params.put("firstname", user.getFirstName());
        params.put("admin", user.isAdmin() ? 1 : 0); // TINYINT(1) -> 0 ou 1
        jdbcTemplate.update(SQL_INSERT_ACCOUNT, params);
        return user;
    }

    public UserRepositoryDto getAccountByUsername(String username) {
        Map<String, Object> params = new HashMap<>();
        params.put("username", username);
        try {
            return jdbcTemplate.queryForObject(SQL_SELECT_ACCOUNT_BY_UNAME, params, (r, s) -> {
                UserRepositoryDto user = new UserRepositoryDto();
                user.setId(String.valueOf(r.getInt("ID")));
                user.setEmail(r.getString("EMAIL"));
                user.setUsername(r.getString("USERNAME"));
                user.setPassword(r.getString("PASSWORD"));
                user.setLastName(r.getString("LASTNAME"));
                user.setFirstName(r.getString("FIRSTNAME"));
                user.setAdmin(r.getInt("ADMIN") == 1); // 1 = true, 0 = false
                return user;
            });
        } catch (Exception e) {
            return null;
        }
    }

    public UserRepositoryDto getAccountByEmail(String email) {
        Map<String, Object> params = new HashMap<>();
        params.put("email", email);
        try {
            return jdbcTemplate.queryForObject(SQL_SELECT_ACCOUNT_BY_MAIL, params, (r, s) -> {
                UserRepositoryDto user = new UserRepositoryDto();
                user.setId(String.valueOf(r.getInt("ID")));
                user.setEmail(r.getString("EMAIL"));
                user.setUsername(r.getString("USERNAME"));
                user.setPassword(r.getString("PASSWORD"));
                user.setLastName(r.getString("LASTNAME"));
                user.setFirstName(r.getString("FIRSTNAME"));
                user.setAdmin(r.getInt("ADMIN") == 1); // 1 = true, 0 = false
                return user;
            });
        } catch (Exception e) {
            return null;
        }
    }
}