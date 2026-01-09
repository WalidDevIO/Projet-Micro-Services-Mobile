package com.example.ubo.authapi.configuration;

import jakarta.ws.rs.ApplicationPath;
import org.glassfish.jersey.server.ResourceConfig;
import org.springframework.context.annotation.Configuration;

@Configuration
@ApplicationPath("/api/v1")
public class JerseyConfig extends ResourceConfig {

    public JerseyConfig(){
        packages("com.example.ubo.authapi.controller");
        register(CORSResponseHeader.class);
    }
}
