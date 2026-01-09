package com.example.ubo.authapi.entity;

public class UserEntity {
    private String username;
    private String email;
    private String password;
    private String lastName;
    private String firstName;

    public UserEntity() {
    }

    public UserEntity(String username, String email, String password, String lastName, String firstName) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.lastName = lastName;
        this.firstName = firstName;
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

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public UserEntity username(String username) {
        this.username = username;
        return this;
    }

    public UserEntity email(String email) {
        this.email = email;
        return this;
    }

    public UserEntity password(String password) {
        this.password = password;
        return this;
    }

    public UserEntity fistName(String firstName) {
        this.firstName = firstName;
        return this;
    }

    public UserEntity lastName(String lastName) {
        this.lastName = lastName;
        return this;
    }
}
