package com.memora.statistics.controller;

import com.memora.config.security.UsuarioAutenticado;
import com.memora.statistics.dto.StatisticsResponse;
import com.memora.statistics.service.StatisticsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/statistics")
@RequiredArgsConstructor
@Tag(name = "Estatísticas", description = "Métricas avançadas de estudo: XP, acertos, atividade e matérias")
public class StatisticsController {

    private final StatisticsService statisticsService;

    @GetMapping
    @Operation(summary = "Retorna o painel completo de estatísticas do usuário autenticado")
    public ResponseEntity<StatisticsResponse> estatisticas() {
        var usuario = UsuarioAutenticado.obter();
        return ResponseEntity.ok(statisticsService.obterEstatisticas(usuario.getId()));
    }
}
