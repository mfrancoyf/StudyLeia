package com.memora.integration.ai;

import com.memora.integration.ai.dto.PlanoEstudosGerado;
import com.memora.integration.ai.dto.QuestaoGerada;

import java.time.LocalDate;
import java.util.List;

/**
 * Contrato único que toda implementação de provedor de IA deve
 * seguir (Gemini, Groq, OpenRouter, ou o MockAIProvider local).
 *
 * Essa interface é o que permite trocar de provedor apenas mudando
 * a propriedade `memora.ia.provider` no application.yml — nenhuma
 * outra camada do sistema (Controllers, Services de domínio) conhece
 * detalhes de nenhuma API externa específica.
 *
 * Padrão exigido: Controller → Service → AIProvider → API Externa.
 * Os Services de quiz/studyplan dependem apenas desta interface.
 */
public interface AIProvider {

    /**
     * Gera uma lista de questões de múltipla escolha sobre o tema
     * informado, na dificuldade e quantidade solicitadas. Cada
     * questão deve ter exatamente uma alternativa marcada como
     * correta.
     */
    List<QuestaoGerada> gerarQuestoes(String tema, int quantidade, String dificuldade);

    /**
     * Gera um plano de estudos (cronograma com estudo, revisões e
     * simulados) para a matéria informada, distribuído entre hoje e
     * a data da prova, respeitando a quantidade de horas disponíveis
     * por dia.
     */
    PlanoEstudosGerado gerarPlanoEstudos(String materia, LocalDate dataProva, double horasDisponiveisPorDia);

    /**
     * Identificador do provedor, usado em logs e para o frontend
     * eventualmente mostrar "gerado com IA (Gemini)" etc.
     */
    String nomeProvedor();
}
