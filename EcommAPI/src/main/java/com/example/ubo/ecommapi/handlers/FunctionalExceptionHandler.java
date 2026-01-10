package com.example.ubo.ecommapi.handlers;

import com.example.ubo.ecommapi.exceptions.FunctionalException;
import dto.ecommapi.Error;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;
import java.util.logging.Logger;

@Provider
public class FunctionalExceptionHandler implements ExceptionMapper<FunctionalException> {
    private static final Logger logger = Logger.getLogger(FunctionalExceptionHandler.class.getName());

    @Override
    public Response toResponse(FunctionalException e) {
        logger.warning(e.getCode() + ": " + e.getMessage());

        return Response
                .status(400)
                .entity(new Error().code(e.getCode()).message(e.getMessage()))
                .build();
    }
}