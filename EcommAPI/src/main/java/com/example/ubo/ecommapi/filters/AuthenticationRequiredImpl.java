package com.example.ubo.ecommapi.filters;

import com.example.ubo.ecommapi.clients.AuthApiClient;
import dto.ecommapi.Error;
import jakarta.inject.Inject;
import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.container.ContainerRequestFilter;
import jakarta.ws.rs.container.ResourceInfo;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MultivaluedMap;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.SecurityContext;
import jakarta.ws.rs.ext.Provider;

import java.lang.reflect.Method;
import java.security.Principal;
import java.util.List;

@Provider
@AuthenticationRequired
public class AuthenticationRequiredImpl implements ContainerRequestFilter {

    @Inject
    private AuthApiClient authClient;

    @Context
    private ResourceInfo resourceInfo;

    @Override
    public void filter(ContainerRequestContext requestContext) {
        try {
            MultivaluedMap<String, String> headers = requestContext.getHeaders();
            List<String> authHeader = headers.get("Authentication");
            if(authHeader == null || authHeader.size() != 1) {
                throw new Exception("Malformed authentication header.");
            }
            var cr = authClient.validate(authHeader.get(0));
            if(!cr.isValid()) throw new Exception("Invalid token.");

            var securityContext = requestContext.getSecurityContext();
            requestContext.setSecurityContext(new SecurityContext() {
                @Override
                public Principal getUserPrincipal() {
                    return cr::getId;
                }

                @Override
                public boolean isUserInRole(String s) {
                    if(s.equals("admin")) {
                        return cr.isAdmin();
                    }
                    return true;
                }

                @Override
                public boolean isSecure() {
                    return securityContext.isSecure();
                }

                @Override
                public String getAuthenticationScheme() {
                    return "JWT";
                }
            });

            Method method = resourceInfo.getResourceMethod();
            Class<?> resourceClass = resourceInfo.getResourceClass();

            boolean adminCheck = (resourceClass != null && resourceClass.isAnnotationPresent(AdminRequired.class))
                    || method.isAnnotationPresent(AdminRequired.class);
            if (adminCheck && !cr.isAdmin()) {
                requestContext.abortWith(
                        Response.status(Response.Status.FORBIDDEN)
                                .entity(new Error().code(403).message("Admin requis."))
                                .build()
                );
            }

        } catch(Exception e) {
            requestContext.abortWith(Response.status(401).entity(new Error().code(401).message("Connexion requise.")).build());
        }
    }
}
