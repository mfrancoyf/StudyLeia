package com.memora.gamification.controller;

import com.memora.config.security.UsuarioAutenticado;
import com.memora.gamification.dto.AchievementResponse;
import com.memora.gamification.dto.ProgressoResponse;
import com.memora.gamification.entity.TipoConquista;
import com.memora.gamification.service.AchievementService;
import com.memora.gamification.service.GamificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/gamification")
@RequiredArgsConstructor
@Tag(name = "Gamificação", description = "XP, nível, moedas, streak e conquistas")
public class GamificationController {

    private final GamificationService gamificationService;
    private final AchievementService achievementService;

    @GetMapping("/progresso")
    @Operation(summary = "Retorna XP, nível, moedas, streak e conquistas desbloqueadas do usuário autenticado")
    public ResponseEntity<ProgressoResponse> progresso() {
        var usuario = UsuarioAutenticado.obter();
        return ResponseEntity.ok(gamificationService.obterProgressoCompleto(usuario.getId()));
    }

    @GetMapping("/achievements")
    @Operation(summary = "Lista todas as conquistas (badges) já desbloqueadas pelo usuário autenticado")
    public ResponseEntity<List<AchievementResponse>> achievements() {
        var usuario = UsuarioAutenticado.obter();
        List<AchievementResponse> resposta = achievementService.listarConquistas(usuario.getId())
                .stream()
                .map(a -> new AchievementResponse(
                        a.getTipo().name(),
                        titulo(a.getTipo()),
                        descricao(a.getTipo()),
                        a.getDesbloqueadaEm()
                ))
                .toList();
        return ResponseEntity.ok(resposta);
    }

    @GetMapping("/achievements/catalogo")
    @Operation(summary = "Lista TODAS as conquistas possíveis (desbloqueadas ou não), para o frontend exibir badges bloqueados")
    public ResponseEntity<List<AchievementResponse>> catalogoAchievements() {
        List<AchievementResponse> resposta = java.util.Arrays.stream(TipoConquista.values())
                .map(tipo -> new AchievementResponse(tipo.name(), titulo(tipo), descricao(tipo), null))
                .toList();
        return ResponseEntity.ok(resposta);
    }

    private String titulo(TipoConquista tipo) {
        return switch (tipo) {
            case PRIMEIRA_PROVA -> "Primeira Prova";
            case SEQUENCIA_7_DIAS -> "7 Dias de Sequência";
            case SEQUENCIA_30_DIAS -> "30 Dias de Sequência";
            case CEM_QUESTOES_RESPONDIDAS -> "100 Questões Respondidas";
            case MIL_XP -> "1000 XP";
            case CINCO_MIL_XP -> "5000 XP";
            case PRIMEIRA_ANOTACAO -> "Primeira Anotação";
            case PRIMEIRO_PLANO_CONCLUIDO -> "Primeiro Plano Concluído";
            case DEZ_QUIZZES_CRIADOS -> "10 Quizzes Criados";
            case NIVEL_10 -> "Nível 10";
            case NIVEL_20 -> "Nível 20";
            case NIVEL_30 -> "Nível 30 — Rainha Leia";
        };
    }

    private String descricao(TipoConquista tipo) {
        return switch (tipo) {
            case PRIMEIRA_PROVA -> "Respondeu seu primeiro quiz na plataforma.";
            case SEQUENCIA_7_DIAS -> "Estudou por 7 dias consecutivos.";
            case SEQUENCIA_30_DIAS -> "Estudou por 30 dias consecutivos. Dedicação de verdade!";
            case CEM_QUESTOES_RESPONDIDAS -> "Respondeu corretamente 100 questões.";
            case MIL_XP -> "Acumulou 1.000 pontos de experiência.";
            case CINCO_MIL_XP -> "Acumulou 5.000 pontos de experiência.";
            case PRIMEIRA_ANOTACAO -> "Criou sua primeira anotação de estudo.";
            case PRIMEIRO_PLANO_CONCLUIDO -> "Concluiu seu primeiro plano de estudos completo.";
            case DEZ_QUIZZES_CRIADOS -> "Criou 10 quizzes na plataforma.";
            case NIVEL_10 -> "Alcançou o nível 10. A Leia já é adulta!";
            case NIVEL_20 -> "Alcançou o nível 20. A Leia se tornou sábia!";
            case NIVEL_30 -> "Alcançou o nível 30. A Leia agora é a Rainha Leia!";
        };
    }
}
