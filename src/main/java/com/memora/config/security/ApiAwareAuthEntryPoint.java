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
 * Decide o que fazer quando uma requisição não autenticada acerta uma
 * rota protegida: se for uma chamada de API (prefixo /api), devolve
 * 401 em JSON (para o JS/HTMX tratar). Se for navegação de página,
 * redireciona para a tela de login — UX melhor do que um 401 cru.
 */
@Component
public class ApiAwareAuthEntryPoint implements AuthenticationEntryPoint {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException)
            throws IOException, ServletException {

        boolean ehApi = request.getRequestURI().startsWith("/api/");
        boolean ehHtmx = "true".equals(request.getHeader("HX-Request"));

        if (ehApi || ehHtmx) {
            response.setStatus(HttpStatus.UNAUTHORIZED.value());
            response.setContentType("application/json;charset=UTF-8");
            ErroResponse erro = new ErroResponse(
                    HttpStatus.UNAUTHORIZED.value(),
                    "Não autenticado",
                    "Sua sessão expirou. Faça login novamente.",
                    request.getRequestURI()
            );
            response.getWriter().write(objectMapper.writeValueAsString(erro));
        } else {
            response.sendRedirect("/login");
        }
    }
}
