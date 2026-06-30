package com.memora.integration.ai.provider;

import com.memora.integration.ai.AIProvider;
import com.memora.integration.ai.dto.ItemCronogramaGerado;
import com.memora.integration.ai.dto.PlanoEstudosGerado;
import com.memora.integration.ai.dto.QuestaoGerada;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

/**
 * Implementação de IA que NÃO depende de nenhuma chave de API
 * externa — gera conteúdo localmente usando templates e variação
 * pseudo-aleatória. Existe para que o Memora funcione 100%
 * "out-of-the-box" assim que clonado, sem exigir configuração de
 * conta em nenhum provedor de IA.
 *
 * Quando a usuária configurar uma chave real (Gemini/Groq/OpenRouter)
 * e trocar `memora.ia.provider` no application.yml, esta
 * implementação deixa de ser usada automaticamente — sem precisar
 * tocar em nenhuma linha do restante do sistema.
 *
 * @Primary garante que esta é a implementação padrão quando nenhuma
 * outra está qualificada para o provider ativo (ver AIProviderConfig).
 */
@Slf4j
@Component("MOCK")
public class MockAIProvider implements AIProvider {

    private final Random random = new Random();

    @Override
    public List<QuestaoGerada> gerarQuestoes(String tema, int quantidade, String dificuldade) {
        log.info("[MockAIProvider] Gerando {} questões sobre '{}' (dificuldade: {})", quantidade, tema, dificuldade);

        List<QuestaoGerada> questoes = new ArrayList<>();
        for (int i = 1; i <= quantidade; i++) {
            questoes.add(gerarQuestaoTemplate(tema, i, dificuldade));
        }
        return questoes;
    }

    @Override
    public PlanoEstudosGerado gerarPlanoEstudos(String materia, LocalDate dataProva, double horasDisponiveisPorDia) {
        log.info("[MockAIProvider] Gerando plano de estudos para '{}' até {}", materia, dataProva);

        LocalDate hoje = LocalDate.now();
        long diasRestantes = Math.max(1, ChronoUnit.DAYS.between(hoje, dataProva));

        List<ItemCronogramaGerado> itens = new ArrayList<>();
        int totalDiasEstudo = (int) Math.max(1, diasRestantes - 1); // último dia reservado para revisão final

        for (int dia = 0; dia < totalDiasEstudo; dia++) {
            LocalDate data = hoje.plusDays(dia);
            boolean diaDeRevisao = (dia + 1) % 4 == 0; // a cada 4 dias, um dia de revisão
            boolean diaDeSimulado = (dia + 1) % 6 == 0 && dia > 0; // a cada 6 dias, simulado

            if (diaDeSimulado) {
                itens.add(new ItemCronogramaGerado(data, materia, "SIMULADO",
                        "Simulado geral de " + materia + " para testar o que já foi estudado até aqui."));
            } else if (diaDeRevisao) {
                itens.add(new ItemCronogramaGerado(data, materia, "REVISAO",
                        "Revisão dos tópicos estudados nos últimos dias, com foco nos pontos de maior dificuldade."));
            } else {
                String subtopico = escolherSubtopico(materia, dia);
                itens.add(new ItemCronogramaGerado(data, subtopico, "ESTUDO",
                        "Estudar " + subtopico + " com " + formatarHoras(horasDisponiveisPorDia)
                                + " de dedicação. Fazer resumo e 5 questões de fixação ao final."));
            }
        }

        // Último dia antes da prova: sempre revisão geral + simulado final
        itens.add(new ItemCronogramaGerado(dataProva.minusDays(1), materia, "REVISAO",
                "Revisão final geral de " + materia + ". Reler os resumos e revisar os pontos marcados como difíceis."));

        String resumo = "Cronograma de %d dias para %s, distribuído em blocos diários de aproximadamente %s, "
                .formatted(diasRestantes, materia, formatarHoras(horasDisponiveisPorDia))
                + "com revisões periódicas e simulados intercalados, terminando num dia de revisão geral antes da prova.";

        return new PlanoEstudosGerado(resumo, itens);
    }

    @Override
    public String nomeProvedor() {
        return "MOCK";
    }

    private QuestaoGerada gerarQuestaoTemplate(String tema, int numero, String dificuldade) {
        String pergunta = "Questão %d sobre %s (nível %s): qual das alternativas melhor representa um conceito-chave de %s?"
                .formatted(numero, tema, dificuldade.toLowerCase(), tema);

        List<QuestaoGerada.AlternativaGerada> alternativas = new ArrayList<>();
        int correta = random.nextInt(4);
        String[] letras = {"A", "B", "C", "D"};

        for (int i = 0; i < 4; i++) {
            boolean ehCorreta = i == correta;
            String texto = ehCorreta
                    ? "Conceito central e corretamente associado a " + tema
                    : "Alternativa de distração relacionada a " + tema + " (opção " + letras[i] + ")";
            alternativas.add(new QuestaoGerada.AlternativaGerada(letras[i], texto, ehCorreta));
        }

        return new QuestaoGerada(pergunta, alternativas);
    }

    private String escolherSubtopico(String materia, int dia) {
        // Sem um LLM real, não temos como saber os subtópicos reais da
        // matéria — geramos uma variação textual simples para que o
        // cronograma pareça uma progressão e não o mesmo dia repetido.
        String[] fases = {"fundamentos", "conceitos intermediários", "aplicações práticas", "tópicos avançados", "casos e exemplos"};
        String fase = fases[dia % fases.length];
        return materia + " — " + fase;
    }

    private String formatarHoras(double horas) {
        if (horas == Math.floor(horas)) {
            return (int) horas + (horas == 1 ? " hora" : " horas");
        }
        return horas + " horas";
    }
}
