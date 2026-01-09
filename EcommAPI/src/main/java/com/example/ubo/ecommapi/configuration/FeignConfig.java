package com.example.ubo.ecommapi.configuration;

import com.example.ubo.ecommapi.clients.AuthApiClient;
import feign.Feign;
import feign.Logger;
import feign.jackson.JacksonDecoder;
import feign.jackson.JacksonEncoder;
import feign.okhttp.OkHttpClient;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;

import java.util.concurrent.TimeUnit;

@Configuration
@Profile("!TEST")
public class FeignConfig {

    private okhttp3.OkHttpClient getOkHttpClient() {
        var okHttpClient = new okhttp3.OkHttpClient.Builder();
        okHttpClient.connectTimeout(10000, TimeUnit.MILLISECONDS);
        okHttpClient.readTimeout(10000, TimeUnit.MILLISECONDS);
        return okHttpClient.build();
    }

    @Value("${auth.api.url}")
    private String authApiUrl;

    @Bean
    AuthApiClient getAuthApiClient() {
        return Feign.builder()
                .encoder(new JacksonEncoder())
                .decoder(new JacksonDecoder())
                .client(new OkHttpClient(getOkHttpClient()))
                .logger(new Logger.JavaLogger(FeignConfig.class))
                .logLevel(Logger.Level.FULL)
                .target(AuthApiClient.class, authApiUrl);
    }

}
