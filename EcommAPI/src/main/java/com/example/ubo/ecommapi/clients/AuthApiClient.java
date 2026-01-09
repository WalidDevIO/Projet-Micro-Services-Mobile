package com.example.ubo.ecommapi.clients;

import dto.authapi.CheckResponse;
import feign.Headers;
import feign.Param;
import feign.RequestLine;

public interface AuthApiClient {

    @RequestLine("GET /verify-token")
    @Headers("Authentication: {token}")
    CheckResponse validate(@Param("token") String token);

}
