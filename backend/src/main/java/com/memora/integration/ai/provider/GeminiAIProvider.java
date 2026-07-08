package com.memora.integration.ai.provider;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.memora.exception.IntegracaoIAException;
import com.memora.integration.ai.AIProvider;
import com.memora.integration.ai.dto.ItemCronogramaGerado;
import com.memora.integration.ai.dto.PlanoEstudosGerado;
import com.memora.integration.ai.dto.QuestaoGerada;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Integração real com a API do Google Gemini (camada gratuita —
 * gemini-1.5-flash). Só é efetivamente usada se
 * `memora.ia.provider=GEMINI` no application.yml e uma chave válida
 * estiver configurada em `memora.ia.gemini.api-key`.
 *
 * O prompt pede explicitamente que o modelo responda em JSON puro,
 * para que a resposta possa ser parseada de forma confiável — uma
 * técnica comum ao integrar LLMs em pipelines estruturados.
 */
@Slf4j
@Component("GEMINI")
public class GeminiAIProvider implements AIProvider {

    private final WebClient webClient;
    private final String apiKey;
    private final String modelo;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public GeminiAIProvider(
            @Value("${memora.ia.gemini.url-base}") String urlBase,
            @Value("${memora.ia.gemini.api-key}") String apiKey,
            @Value("${memora.ia.gemini.modelo}") String modelo
    ) {
        this.webClient = WebClient.builder().baseUrl(urlBase).build();
        this.apiKey = apiKey;
        this.modelo = modelo;
    }

    @Override
    public List<QuestaoGerada> gerarQuestoes(String tema, int quantidade, String dificuldade) {
        validarChave();

        String prompt = """
                Gere exatamente %d questões de múltipla escolha (4 alternativas: A, B, C, D) sobre o tema "%s",
                no nível de dificuldade "%s". Responda APENAS com um JSON válido, sem texto adicional, no formato:
                {"questoes": [{"pergunta": "...", "alternativas": [{"letra": "A", "texto": "...", "correta": true}, ...]}]}
                Apenas uma alternativa por questão deve ter "correta": true.
                """.formatted(quantidade, tema, dificuldade);

        String respostaTexto = chamarGemini(prompt);
        return parsearQuestoes(respostaTexto);
    }

    @Override
    public PlanoEstudosGerado gerarPlanoEstudos(String materia, LocalDate dataProva, double horasDisponiveisPorDia) {
        validarChave();

        String prompt = """
                Crie um cronograma de estudos para a matéria "%s", com prova em %s, considerando %.1f horas
                disponíveis por dia a partir de hoje (%s). Inclua estudo de subtópicos, revisões periódicas e
                ao menos um simulado. Responda APENAS com um JSON válido, sem texto adicional, no formato:
                {"resumo": "...", "itens": [{"data": "AAAA-MM-DD", "assunto": "...", "tipo": "ESTUDO|REVISAO|SIMULADO", "descricao": "..."}]}
                """.formatted(materia, dataProva, horasDisponiveisPorDia, LocalDate.now());

        String respostaTexto = chamarGemini(prompt);
        return parsearPlano(respostaTexto);
    }

    @Override
    public String nomeProvedor() {
        return "GEMINI";
    }

    private void validarChave() {
        if (apiKey == null || apiKey.isBlank()) {
            throw new IntegracaoIAException(
                    "Nenhuma chave de API do Gemini configurada. Defina GEMINI_API_KEY ou troque memora.ia.provider para MOCK.");
        }
    }

   private String chamarGemini(String prompt) {
    try {
        Map<String, Object> corpo = Map.of(
                "contents", List.of(Map.of("parts", List.of(Map.of("text", prompt))))
        );

        JsonNode resposta = webClient.post()
                .uri(uriBuilder -> uriBuilder
                        .path("/{modelo}:generateContent")
                        .queryParam("key", apiKey)
                        .build(modelo))
                .bodyValue(corpo)
                .retrieve()
                .bodyToMono(JsonNode.class)
                .block();

        return resposta
                .path("candidates").get(0)
                .path("content").path("parts").get(0)
                .path("text").asText();

    } catch (Exception ex) {
        log.error("Erro ao chamar Gemini", ex);
        throw new IntegracaoIAException(
                "Falha ao chamar a API do Gemini", ex);
    }
}

    private List<QuestaoGerada> parsearQuestoes(String jsonTexto) {
        try {
            String jsonLimpo = limparBlocoMarkdown(jsonTexto);
            JsonNode raiz = objectMapper.readTree(jsonLimpo);
            List<QuestaoGerada> questoes = new ArrayList<>();

            for (JsonNode q : raiz.path("questoes")) {
                List<QuestaoGerada.AlternativaGerada> alternativas = new ArrayList<>();
                for (JsonNode a : q.path("alternativas")) {
                    alternativas.add(new QuestaoGerada.AlternativaGerada(
                            a.path("letra").asText(),
                            a.path("texto").asText(),
                            a.path("correta").asBoolean(false)
                    ));
                }
                questoes.add(new QuestaoGerada(q.path("pergunta").asText(), alternativas));
            }
            return questoes;
        } catch (Exception ex) {
            throw new IntegracaoIAException("Não foi possível interpretar a resposta da IA (formato inesperado).", ex);
        }
    }

    private PlanoEstudosGerado parsearPlano(String jsonTexto) {
        try {
            String jsonLimpo = limparBlocoMarkdown(jsonTexto);
            JsonNode raiz = objectMapper.readTree(jsonLimpo);
            List<ItemCronogramaGerado> itens = new ArrayList<>();

            for (JsonNode item : raiz.path("itens")) {
                itens.add(new ItemCronogramaGerado(
                        LocalDate.parse(item.path("data").asText()),
                        item.path("assunto").asText(),
                        item.path("tipo").asText("ESTUDO"),
                        item.path("descricao").asText("")
                ));
            }
            return new PlanoEstudosGerado(raiz.path("resumo").asText(""), itens);
        } catch (Exception ex) {
            throw new IntegracaoIAException("Não foi possível interpretar a resposta da IA (formato inesperado).", ex);
        }
    }

    private String limparBlocoMarkdown(String texto) {
        // Modelos generativos às vezes envolvem o JSON em blocos
        // ```json ... ``` mesmo quando instruídos a não fazer isso.
        return texto.replaceAll("```json", "").replaceAll("```", "").trim();
    }
}
