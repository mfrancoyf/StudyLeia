package com.memora.integration.ai.provider;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.memora.exception.IntegracaoIAException;
import com.memora.integration.ai.dto.ItemCronogramaGerado;
import com.memora.integration.ai.dto.PlanoEstudosGerado;
import com.memora.integration.ai.dto.QuestaoGerada;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/**
 * Lógica de montagem de prompt e parsing de resposta compartilhada
 * entre provedores que seguem o formato de API compatível com
 * OpenAI (chat completions) — caso do Groq e do OpenRouter. Evita
 * duplicar a mesma construção de prompt/parsing em cada classe.
 */
final class PromptsIAUtil {

    private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();

    private PromptsIAUtil() {
    }

    static String montarPromptQuestoes(String tema, int quantidade, String dificuldade) {
        return """
                Gere exatamente %d questões de múltipla escolha (4 alternativas: A, B, C, D) sobre o tema "%s",
                no nível de dificuldade "%s". Responda APENAS com um JSON válido, sem texto adicional, sem
                blocos de markdown, no formato:
                {"questoes": [{"pergunta": "...", "alternativas": [{"letra": "A", "texto": "...", "correta": true}, ...]}]}
                Apenas uma alternativa por questão deve ter "correta": true.
                """.formatted(quantidade, tema, dificuldade);
    }

    static String montarPromptPlano(String materia, LocalDate dataProva, double horasDisponiveisPorDia) {
        return """
                Crie um cronograma de estudos para a matéria "%s", com prova em %s, considerando %.1f horas
                disponíveis por dia a partir de hoje (%s). Inclua estudo de subtópicos, revisões periódicas e
                ao menos um simulado. Responda APENAS com um JSON válido, sem texto adicional, sem blocos de
                markdown, no formato:
                {"resumo": "...", "itens": [{"data": "AAAA-MM-DD", "assunto": "...", "tipo": "ESTUDO|REVISAO|SIMULADO", "descricao": "..."}]}
                """.formatted(materia, dataProva, horasDisponiveisPorDia, LocalDate.now());
    }

    static List<QuestaoGerada> parsearQuestoes(String jsonTexto) {
        try {
            JsonNode raiz = OBJECT_MAPPER.readTree(limpar(jsonTexto));
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

    static PlanoEstudosGerado parsearPlano(String jsonTexto) {
        try {
            JsonNode raiz = OBJECT_MAPPER.readTree(limpar(jsonTexto));
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

    private static String limpar(String texto) {
        return texto.replaceAll("```json", "").replaceAll("```", "").trim();
    }
}
