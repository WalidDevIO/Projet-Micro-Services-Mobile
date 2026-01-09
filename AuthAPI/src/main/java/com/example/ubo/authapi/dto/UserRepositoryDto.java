package com.example.ubo.authapi.dto;

public class UserRepositoryDto {
    private String username;
    private String email;
    private String password;
    private String lastName;
    private String firstName;

    public UserRepositoryDto() {
    }

    public UserRepositoryDto(String username, String email, String password, String firstName, String lastName) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
    }

    public String getUsername() {
        return username;
    }

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    public String getLastName() {
        return lastName;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public UserRepositoryDto username(String username) {
        this.username = username;
        return this;
    }

    public UserRepositoryDto email(String email) {
        this.email = email;
        return this;
    }

    public UserRepositoryDto password(String password) {
        this.password = password;
        return this;
    }
}
