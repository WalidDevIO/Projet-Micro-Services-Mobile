package com.example.ubo.ecommapi.configuration;

import jakarta.ws.rs.ApplicationPath;
import org.glassfish.jersey.server.ResourceConfig;
import org.springframework.context.annotation.Configuration;

@Configuration
@ApplicationPath("/api/v1")
public class JerseyConfig extends ResourceConfig {

    public JerseyConfig(){
        packages("com.example.ubo.ecommapi.controller");
        packages("com.example.ubo.ecommapi.handlers");
        packages("com.example.ubo.ecommapi.filters");
    }
}
