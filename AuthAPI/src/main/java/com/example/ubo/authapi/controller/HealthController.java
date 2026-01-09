package com.example.ubo.authapi.controller;

import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.core.Response;
import org.springframework.stereotype.Controller;

@Controller
@Path("/health")
public class HealthController {
    @GET
    public Response health(){
        return Response.ok("I'm up !").build();
    }
}
