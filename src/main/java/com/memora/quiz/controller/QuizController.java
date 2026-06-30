package com.memora.quiz.controller;

import com.memora.config.security.UsuarioAutenticado;
import com.memora.gamification.dto.RecompensaResponse;
import com.memora.quiz.dto.*;
import com.memora.quiz.service.QuizService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/quizzes")
@RequiredArgsConstructor
@Tag(name = "Quizzes", description = "Criação manual e via IA de quizzes, e fluxo de resposta gamificado")
public class QuizController {

    private final QuizService quizService;

    @GetMapping
    @Operation(summary = "Lista todos os quizzes do usuário autenticado")
    public ResponseEntity<List<QuizResumoResponse>> listar() {
        var usuario = UsuarioAutenticado.obter();
        return ResponseEntity.ok(quizService.listarPorUsuario(usuario.getId()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Busca um quiz completo (questões e alternativas, sem revelar a correta)")
    public ResponseEntity<QuizResponse> buscar(@PathVariable UUID id) {
        var usuario = UsuarioAutenticado.obter();
        return ResponseEntity.ok(quizService.buscarPorId(id, usuario.getId()));
    }

    @PostMapping
    @Operation(summary = "Cria um quiz manualmente, com questões e alternativas informadas pela usuária")
    public ResponseEntity<QuizResponse> criarManual(@Valid @RequestBody QuizCriarRequest request) {
        var usuario = UsuarioAutenticado.obter();
        return ResponseEntity.status(201).body(quizService.criarManual(usuario, request));
    }

    @PostMapping("/gerar-com-ia")
    @Operation(summary = "Gera um quiz automaticamente via IA a partir de um tema, quantidade e dificuldade")
    public ResponseEntity<QuizResponse> gerarComIA(@Valid @RequestBody GerarQuizIARequest request) {
        var usuario = UsuarioAutenticado.obter();
        return ResponseEntity.status(201).body(quizService.gerarComIA(usuario, request));
    }

    @PostMapping("/{quizId}/questoes/{questaoId}/responder")
    @Operation(summary = "Envia a resposta da usuária para uma questão e concede XP/moedas")
    public ResponseEntity<RespostaQuestaoResultado> responder(
            @PathVariable UUID quizId,
            @PathVariable UUID questaoId,
            @Valid @RequestBody ResponderQuestaoRequest request
    ) {
        var usuario = UsuarioAutenticado.obter();
        return ResponseEntity.ok(quizService.responderQuestao(usuario, quizId, questaoId, request));
    }

    @PostMapping("/{quizId}/concluir")
    @Operation(summary = "Marca o quiz como concluído e concede o bônus de XP de conclusão")
    public ResponseEntity<RecompensaResponse> concluir(@PathVariable UUID quizId) {
        var usuario = UsuarioAutenticado.obter();
        return ResponseEntity.ok(quizService.concluirQuiz(usuario, quizId));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Remove um quiz")
    public ResponseEntity<Void> excluir(@PathVariable UUID id) {
        var usuario = UsuarioAutenticado.obter();
        quizService.excluir(id, usuario.getId());
        return ResponseEntity.noContent().build();
    }
}
