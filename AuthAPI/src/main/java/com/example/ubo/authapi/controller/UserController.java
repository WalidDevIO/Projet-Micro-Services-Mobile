package com.example.ubo.authapi.controller;

import org.springframework.stereotype.Controller;

import com.example.ubo.authapi.business.UserBusiness;

import dto.authapi.ErrorResponse;
import dto.authapi.LoginRequest;
import dto.authapi.RegisterRequest;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.HeaderParam;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Controller
@Path("/")
public class UserController {
    
    @Inject
    private UserBusiness userBusiness;

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @Path("/signin")
    public Response login(LoginRequest loginRequest) {
        var loginResponse = userBusiness.login(loginRequest);
        if (!loginResponse.isSuccess()) {
            return Response
                .status(401)
                .entity(new ErrorResponse()
                    .code("AUTH_001")
                    .message("Identifiants incorrects.")
                ).build();
        }
        return Response.ok(loginResponse).build();
    }
    
    @DELETE
    @Produces(MediaType.APPLICATION_JSON)
    @Path("/logout")
    public Response logout(@HeaderParam("Authentication") String token) {
        var check = userBusiness.check(token);
        if(check.isValid() == false) {
            return Response
                .status(401)
                .entity(new ErrorResponse()
                    .code("AUTH_003")
                    .message("Token invalide ou expiré.")
                ).build();
        }
        return Response.ok(userBusiness.logout(token.replace("Bearer ", ""))).build();
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Path("/verify-token")
    public Response check(@HeaderParam("Authentication") String token) {
        var check = userBusiness.check(token);
        return Response.ok(check).build();
    }

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @Path("/signup")
    public Response register(RegisterRequest registerRequest) {
        var registerResponse = userBusiness.register(registerRequest);
        if (!registerResponse.isSuccess()) {
            return Response
                .status(409)
                .entity(new ErrorResponse()
                    .code("AUTH_002")
                    .message("Nom d'utilisateur déjà pris.")
                ).build();
        }
        return Response.ok(registerResponse).build();
    }
    
}
