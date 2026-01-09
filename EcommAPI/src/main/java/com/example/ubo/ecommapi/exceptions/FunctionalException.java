package com.example.ubo.ecommapi.exceptions;

public class FunctionalException extends RuntimeException {

    private final int code;
    private final String description;

    public FunctionalException(int code, String description) {
        super(description);
        this.code = code;
        this.description = description;
    }

    public int getCode() {
        return code;
    }

    public String getDescription() {
        return description;
    }
}
