package com.memora.integration.ai.dto;

import java.util.List;

/**
 * Representação neutra de uma questão gerada por IA, desacoplada do
 * formato de resposta específico de qualquer provedor (Gemini, Groq,
 * OpenRouter). Cada AIProvider é responsável por converter a resposta
 * "crua" da sua API externa para esta estrutura comum.
 */
public record QuestaoGerada(
        String pergunta,
        List<AlternativaGerada> alternativas
) {
    public record AlternativaGerada(
            String letra,
            String texto,
            boolean correta
    ) {
    }
}
