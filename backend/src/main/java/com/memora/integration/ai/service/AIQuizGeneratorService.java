package com.memora.integration.ai.service;

import com.memora.integration.ai.AIProvider;
import com.memora.integration.ai.dto.QuestaoGerada;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Camada intermediária entre o QuizController/QuizService e o
 * AIProvider ativo. Mantém o padrão exigido pela Stack Obrigatória:
 * Controller → Service → AIProvider → API Externa. O QuizService
 * (módulo quiz) chama este service em vez de depender diretamente da
 * interface AIProvider, deixando claro que "gerar questões com IA"
 * é uma responsabilidade própria, reaproveitável por outros pontos
 * do sistema se necessário.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AIQuizGeneratorService {

    private final AIProvider aiProvider;

    public List<QuestaoGerada> gerarQuestoes(String tema, int quantidade, String dificuldade) {
        log.info("Gerando {} questões sobre '{}' via provider {}", quantidade, tema, aiProvider.nomeProvedor());
        return aiProvider.gerarQuestoes(tema, quantidade, dificuldade);
    }
}
