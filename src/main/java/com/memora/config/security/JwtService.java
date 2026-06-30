package com.memora.config.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

/**
 * Responsável por toda a manipulação de tokens JWT: gerar um token
 * novo no login/registro, e validar/extrair informações de um token
 * recebido em requisições subsequentes (via JwtAuthFilter).
 */
@Service
public class JwtService {

    private final SecretKey chaveAssinatura;
    private final long expiracaoMinutos;

    public JwtService(
            @Value("${memora.jwt.secret}") String segredo,
            @Value("${memora.jwt.expiracao-minutos}") long expiracaoMinutos
    ) {
        this.chaveAssinatura = Keys.hmacShaKeyFor(segredo.getBytes(StandardCharsets.UTF_8));
        this.expiracaoMinutos = expiracaoMinutos;
    }

    public String gerarToken(UserDetails usuario) {
        return gerarToken(new HashMap<>(), usuario);
    }

    public String gerarToken(Map<String, Object> claimsExtras, UserDetails usuario) {
        Date agora = new Date();
        Date expiracao = new Date(agora.getTime() + expiracaoMinutos * 60 * 1000);

        return Jwts.builder()
                .claims(claimsExtras)
                .subject(usuario.getUsername())
                .issuedAt(agora)
                .expiration(expiracao)
                .signWith(chaveAssinatura)
                .compact();
    }

    public String extrairEmail(String token) {
        return extrairClaim(token, Claims::getSubject);
    }

    public boolean tokenValido(String token, UserDetails usuario) {
        String email = extrairEmail(token);
        return email.equals(usuario.getUsername()) && !tokenExpirado(token);
    }

    private boolean tokenExpirado(String token) {
        return extrairClaim(token, Claims::getExpiration).before(new Date());
    }

    private <T> T extrairClaim(String token, Function<Claims, T> resolvedor) {
        Claims claims = extrairTodasClaims(token);
        return resolvedor.apply(claims);
    }

    private Claims extrairTodasClaims(String token) {
        return Jwts.parser()
                .verifyWith(chaveAssinatura)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
