package com.example.ubo.ecommapi.filters;

import com.example.ubo.ecommapi.clients.AuthApiClient;
import jakarta.inject.Inject;
import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.container.ContainerRequestFilter;
import jakarta.ws.rs.core.MultivaluedMap;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.Provider;

import java.util.List;

@Provider
@AuthenticationRequired
public class AuthenticationRequiredImpl implements ContainerRequestFilter {

    @Inject
    private AuthApiClient authClient;

    @Override
    public void filter(ContainerRequestContext requestContext) {
        try {
            MultivaluedMap<String, String> headers = requestContext.getHeaders();
            List<String> authHeader = headers.get("Authentication");
            if(authHeader == null || authHeader.size() != 1) {
                throw new Exception("Malformed authentication header.");
            }
            if(!authClient
                    .validate(authHeader.get(0))
                    .isValid()
            ) throw new Exception("Invalid token.");
        } catch(Exception e) {
            requestContext.abortWith(Response.status(401).entity(e.getMessage()).build());
        }
    }
}
