package com.memora.config.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.memora.exception.ErroResponse;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;

/**
 * Responde a qualquer requisição não autenticada em uma rota protegida
 * com 401 em JSON. O backend é uma API REST pura — não existe mais
 * página de login no servidor para redirecionar (o front-end oficial é
 * a SPA React, que trata o 401 sozinha via interceptor do axios, ver
 * frontend/src/services/api.ts).
 */
@Component
public class ApiAwareAuthEntryPoint implements AuthenticationEntryPoint {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException)
            throws IOException, ServletException {

        response.setStatus(HttpStatus.UNAUTHORIZED.value());
        response.setContentType("application/json;charset=UTF-8");
        ErroResponse erro = new ErroResponse(
                HttpStatus.UNAUTHORIZED.value(),
                "Não autenticado",
                "Sua sessão expirou. Faça login novamente.",
                request.getRequestURI()
        );
        response.getWriter().write(objectMapper.writeValueAsString(erro));
    }
}
