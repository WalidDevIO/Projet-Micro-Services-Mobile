package com.example.ubo.ecommapi.handlers;

import com.example.ubo.ecommapi.exceptions.FunctionalException;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;

@Provider
public class FunctionalExceptionHandler implements ExceptionMapper<FunctionalException> {
    @Override
    public Response toResponse(FunctionalException e) {
        return Response
                .status(400)
                .entity("TODO: Use error class").build(); //TODO: User error DTO class
    }
}
