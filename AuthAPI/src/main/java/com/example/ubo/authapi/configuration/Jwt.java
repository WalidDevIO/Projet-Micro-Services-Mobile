package com.example.ubo.authapi.configuration;

import io.jsonwebtoken.*;

import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.concurrent.ConcurrentHashMap;
import java.util.function.Function;

@Component
public class Jwt {
    private final SecretKey key = Jwts.SIG.HS256.key().build();
    private final ConcurrentHashMap<String, Boolean> invalidatedTokens = new ConcurrentHashMap<>();

    public String generateToken(String username) {
        long jwtExpiration = 1000 /*ms */ * 60/*seconds*/ * 60;/*minutes*/ //1h
        return Jwts.builder()
                .subject(username)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + jwtExpiration))
                .issuer("auth-api")
                .audience().add("auth-api")
                .and()
                .signWith(key)
                .compact();
    }

    public boolean validateToken(String token) {
        try {
            if (invalidatedTokens.containsKey(token))
                throw new RuntimeException("Invalidated token");
            extractAllClaims(token);
            return true;
        } catch (Exception ignored) {
            return false;
        }
    }

    public void invalidateToken(String token) {
        invalidatedTokens.put(token, true);
    }

    public String getUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    private Claims extractAllClaims(String token) {
        return Jwts
                .parser()
                .requireIssuer("auth-api")
                .requireAudience("auth-api")
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    private <T> T extractClaim(String token, Function<Claims, T> extractor) {
        return extractor.apply(extractAllClaims(token));
    }
}
