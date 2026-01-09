package com.example.ubo.ecommapi.configuration;

import com.example.ubo.ecommapi.clients.AuthApiClient;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import static org.mockito.Mockito.mock;

@Configuration
@Profile("TEST")
public class FeignConfigMock {

    @Bean
    public AuthApiClient getAuthApiClient() {return mock(AuthApiClient.class);}

}
