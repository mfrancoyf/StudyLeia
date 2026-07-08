package com.memora.studyplan.controller;

import com.memora.config.security.UsuarioAutenticado;
import com.memora.studyplan.dto.GerarPlanoEstudosRequest;
import com.memora.studyplan.dto.StudyPlanResponse;
import com.memora.studyplan.dto.StudyPlanResumoResponse;
import com.memora.studyplan.service.StudyPlanService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/study-plans")
@RequiredArgsConstructor
@Tag(name = "Planos de Estudo", description = "Geração de cronogramas de estudo via IA")
public class StudyPlanController {

    private final StudyPlanService studyPlanService;

    @GetMapping
    @Operation(summary = "Lista os planos de estudo do usuário autenticado")
    public ResponseEntity<List<StudyPlanResumoResponse>> listar() {
        var usuario = UsuarioAutenticado.obter();
        return ResponseEntity.ok(studyPlanService.listarPorUsuario(usuario.getId()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Busca um plano de estudos completo, com todos os itens do cronograma")
    public ResponseEntity<StudyPlanResponse> buscar(@PathVariable UUID id) {
        var usuario = UsuarioAutenticado.obter();
        return ResponseEntity.ok(studyPlanService.buscarPorId(id, usuario.getId()));
    }

    @PostMapping("/gerar-com-ia")
    @Operation(summary = "Gera um plano de estudos completo via IA a partir da matéria, data da prova e horas disponíveis")
    public ResponseEntity<StudyPlanResponse> gerarComIA(@Valid @RequestBody GerarPlanoEstudosRequest request) {
        var usuario = UsuarioAutenticado.obter();
        return ResponseEntity.status(201).body(studyPlanService.gerarComIA(usuario, request));
    }

    @PatchMapping("/{planId}/itens/{itemId}/concluir")
    @Operation(summary = "Marca um item do cronograma como concluído; conclui o plano e concede XP quando todos os itens estiverem feitos")
    public ResponseEntity<StudyPlanResponse> marcarItemConcluido(@PathVariable UUID planId, @PathVariable UUID itemId) {
        var usuario = UsuarioAutenticado.obter();
        return ResponseEntity.ok(studyPlanService.marcarItemConcluido(planId, itemId, usuario.getId()));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Remove um plano de estudos")
    public ResponseEntity<Void> excluir(@PathVariable UUID id) {
        var usuario = UsuarioAutenticado.obter();
        studyPlanService.excluir(id, usuario.getId());
        return ResponseEntity.noContent().build();
    }
}
