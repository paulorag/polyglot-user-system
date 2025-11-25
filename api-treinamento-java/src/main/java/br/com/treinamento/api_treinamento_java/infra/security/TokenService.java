package br.com.treinamento.api_treinamento_java.infra.security;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import br.com.treinamento.api_treinamento_java.user.User;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.security.Key;

@Service
public class TokenService {

    @Value("${api.security.token.secret}")
    private String secret;

    public String generateToken(User user) {
        try {
            return Jwts.builder()
                    .setIssuer("api-treinamento-java")
                    .setSubject(user.getEmail())
                    .setExpiration(genExpirationDate())
                    .signWith(getSigningKey())
                    .compact();
        } catch (Exception exception) {
            throw new RuntimeException("Erro ao gerar token JWT", exception);
        }
    }

    public String validateToken(String token) {
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody()
                    .getSubject();
        } catch (Exception exception) {
            return "";
        }
    }

    private java.util.Date genExpirationDate() {
        return java.util.Date.from(LocalDateTime.now().plusHours(2).toInstant(ZoneOffset.of("-03:00")));
    }

    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }
}