package com.memora.integration.ai.provider;

import com.fasterxml.jackson.databind.JsonNode;
import com.memora.exception.IntegracaoIAException;
import com.memora.integration.ai.AIProvider;
import com.memora.integration.ai.dto.PlanoEstudosGerado;
import com.memora.integration.ai.dto.QuestaoGerada;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

/**
 * Integração real com a API do OpenRouter, que dá acesso a vários
 * modelos open-source gratuitos (sufixo ":free") através de uma
 * única API compatível com o formato OpenAI. Só é efetivamente usada
 * se `memora.ia.provider=OPENROUTER` e uma chave válida estiver
 * configurada em `memora.ia.openrouter.api-key`.
 */
@Slf4j
@Component("OPENROUTER")
public class OpenRouterAIProvider implements AIProvider {

    private final WebClient webClient;
    private final String apiKey;
    private final String modelo;

    public OpenRouterAIProvider(
            @Value("${memora.ia.openrouter.url-base}") String urlBase,
            @Value("${memora.ia.openrouter.api-key}") String apiKey,
            @Value("${memora.ia.openrouter.modelo}") String modelo
    ) {
        this.webClient = WebClient.builder().baseUrl(urlBase).build();
        this.apiKey = apiKey;
        this.modelo = modelo;
    }

    @Override
    public List<QuestaoGerada> gerarQuestoes(String tema, int quantidade, String dificuldade) {
        validarChave();
        String prompt = PromptsIAUtil.montarPromptQuestoes(tema, quantidade, dificuldade);
        String resposta = chamarChatCompletion(prompt);
        return PromptsIAUtil.parsearQuestoes(resposta);
    }

    @Override
    public PlanoEstudosGerado gerarPlanoEstudos(String materia, LocalDate dataProva, double horasDisponiveisPorDia) {
        validarChave();
        String prompt = PromptsIAUtil.montarPromptPlano(materia, dataProva, horasDisponiveisPorDia);
        String resposta = chamarChatCompletion(prompt);
        return PromptsIAUtil.parsearPlano(resposta);
    }

    @Override
    public String nomeProvedor() {
        return "OPENROUTER";
    }

    private void validarChave() {
        if (apiKey == null || apiKey.isBlank()) {
            throw new IntegracaoIAException(
                    "Nenhuma chave de API do OpenRouter configurada. Defina OPENROUTER_API_KEY ou troque memora.ia.provider para MOCK.");
        }
    }

    private String chamarChatCompletion(String prompt) {
        try {
            Map<String, Object> corpo = Map.of(
                    "model", modelo,
                    "messages", List.of(Map.of("role", "user", "content", prompt))
            );

            JsonNode resposta = webClient.post()
                    .uri("/chat/completions")
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + apiKey)
                    .bodyValue(corpo)
                    .retrieve()
                    .bodyToMono(JsonNode.class)
                    .block();

            return resposta.path("choices").get(0).path("message").path("content").asText();

        } catch (Exception ex) {
            throw new IntegracaoIAException("Falha ao chamar a API do OpenRouter: " + ex.getMessage(), ex);
        }
    }
}
