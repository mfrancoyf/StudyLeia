package com.memora.exception;

import java.time.LocalDateTime;
import java.util.Map;

/**
 * Formato único de resposta de erro usado em toda a API. Mantém a
 * resposta de erro previsível para quem consome a API (e para o
 * próprio frontend HTMX, que confere o status code).
 */
public record ErroResponse(
        LocalDateTime momento,
        int status,
        String erro,
        String mensagem,
        String caminho,
        Map<String, String> camposInvalidos
) {
    public ErroResponse(int status, String erro, String mensagem, String caminho) {
        this(LocalDateTime.now(), status, erro, mensagem, caminho, null);
    }

    public ErroResponse(int status, String erro, String mensagem, String caminho, Map<String, String> camposInvalidos) {
        this(LocalDateTime.now(), status, erro, mensagem, caminho, camposInvalidos);
    }
}
