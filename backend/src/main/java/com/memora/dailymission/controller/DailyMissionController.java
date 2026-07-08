package com.memora.dailymission.controller;

import com.memora.config.security.UsuarioAutenticado;
import com.memora.dailymission.dto.DailyMissionResponse;
import com.memora.dailymission.service.DailyMissionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/missions")
@RequiredArgsConstructor
@Tag(name = "Missões Diárias", description = "Missões geradas automaticamente todo dia, com XP e moedas de bônus")
public class DailyMissionController {

    private final DailyMissionService dailyMissionService;

    @GetMapping("/hoje")
    @Operation(summary = "Lista as missões diárias de hoje (gera automaticamente se ainda não existirem)")
    public ResponseEntity<List<DailyMissionResponse>> missoesDeHoje() {
        var usuario = UsuarioAutenticado.obter();
        return ResponseEntity.ok(dailyMissionService.obterMissoesDoDia(usuario));
    }
}
