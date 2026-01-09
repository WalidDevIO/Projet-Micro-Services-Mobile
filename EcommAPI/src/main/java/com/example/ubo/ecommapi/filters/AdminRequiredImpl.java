package com.example.ubo.ecommapi.filters;

import com.example.ubo.ecommapi.clients.AuthApiClient;
import jakarta.inject.Inject;
import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.container.ContainerRequestFilter;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.SecurityContext;
import jakarta.ws.rs.ext.Provider;
import dto.ecommapi.Error;

@Provider
@AuthenticationRequired
public class AdminRequiredImpl implements ContainerRequestFilter {

    @Override
    public void filter(ContainerRequestContext requestContext) {
        SecurityContext securityContext = requestContext.getSecurityContext();

        if (!securityContext.isUserInRole("admin")) {
            requestContext.abortWith(
                    Response.status(Response.Status.FORBIDDEN)
                            .entity(new Error().code(403).message("Droit admin requis."))
                            .build()
            );
        }
    }
}
