package com.memora.integration.ai.service;

import com.memora.integration.ai.AIProvider;
import com.memora.integration.ai.dto.PlanoEstudosGerado;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Slf4j
@Service
@RequiredArgsConstructor
public class AIStudyPlanGeneratorService {

    private final AIProvider aiProvider;

    public PlanoEstudosGerado gerarPlano(String materia, LocalDate dataProva, double horasDisponiveisPorDia) {
        log.info("Gerando plano de estudos para '{}' via provider {}", materia, aiProvider.nomeProvedor());
        return aiProvider.gerarPlanoEstudos(materia, dataProva, horasDisponiveisPorDia);
    }
}
