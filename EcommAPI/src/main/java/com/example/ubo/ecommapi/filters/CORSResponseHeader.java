package com.example.ubo.ecommapi.filters;

import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.container.ContainerResponseContext;
import jakarta.ws.rs.container.ContainerResponseFilter;
import jakarta.ws.rs.core.MultivaluedMap;
import jakarta.ws.rs.ext.Provider;

@Provider
public class CORSResponseHeader implements ContainerResponseFilter {
    public void filter(ContainerRequestContext requestContext, ContainerResponseContext responseContext) {
        MultivaluedMap<String, Object> headers = responseContext.getHeaders();
        headers.add("Access-Control-Allow-Origin", "*");
        headers.add("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT");
        headers.add("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");
    }
}
