package com.example.ubo.ecommapi.filters;

import com.example.ubo.ecommapi.clients.AuthApiClient;
import jakarta.inject.Inject;
import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.container.ContainerRequestFilter;
import jakarta.ws.rs.container.PreMatching;
import jakarta.ws.rs.core.MultivaluedMap;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.SecurityContext;
import jakarta.ws.rs.ext.Provider;

import java.security.Principal;
import java.util.List;

@Provider
@AuthenticationRequired
@PreMatching
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
            var cr = authClient.validate(authHeader.get(0));
            if(!cr.isValid()) throw new Exception("Invalid token.");
            var securityContext = requestContext.getSecurityContext();

            requestContext.setSecurityContext(new SecurityContext() {
                @Override
                public Principal getUserPrincipal() {
                    return cr::getUsername; //TODO: Use userId instead
                }

                @Override
                public boolean isUserInRole(String s) {
                    return true; //TODO: Add admin flag on check response
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
        } catch(Exception e) {
            requestContext.abortWith(Response.status(401).entity(e.getMessage()).build());
        }
    }
}
