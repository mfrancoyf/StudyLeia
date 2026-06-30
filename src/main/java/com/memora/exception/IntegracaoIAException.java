package com.memora.exception;

/**
 * Lançada quando a camada de integração com o provedor de IA
 * (Gemini, Groq, OpenRouter) falha — chave inválida, indisponibilidade,
 * resposta malformada, etc. Mapeada para HTTP 502 (Bad Gateway).
 */
public class IntegracaoIAException extends RuntimeException {

    public IntegracaoIAException(String mensagem) {
        super(mensagem);
    }

    public IntegracaoIAException(String mensagem, Throwable causa) {
        super(mensagem, causa);
    }
}
