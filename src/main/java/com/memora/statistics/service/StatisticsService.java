package com.memora.statistics.service;

import com.memora.gamification.entity.UserProgress;
import com.memora.gamification.service.GamificationService;
import com.memora.gamification.service.StreakService;
import com.memora.quiz.entity.QuizAttempt;
import com.memora.quiz.repository.QuizAttemptRepository;
import com.memora.statistics.dto.EstatisticaPorTema;
import com.memora.statistics.dto.PontoSerieTemporal;
import com.memora.statistics.dto.StatisticsResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.TextStyle;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Agrega dados de gamification, quiz e focus para montar o painel de
 * estatísticas avançadas. É um módulo somente leitura — não possui
 * entidade própria, apenas consultas combinadas sobre dados que já
 * existem nos outros módulos.
 */
@Service
@RequiredArgsConstructor
public class StatisticsService {

    private final GamificationService gamificationService;
    private final StreakService streakService;
    private final QuizAttemptRepository quizAttemptRepository;

    @Transactional(readOnly = true)
    public StatisticsResponse obterEstatisticas(UUID usuarioId) {
        UserProgress progresso = gamificationService.buscarPorUsuario(usuarioId);
        var streak = streakService.buscarPorUsuario(usuarioId);

        long totalRespondidas = quizAttemptRepository.countByUsuarioId(usuarioId);
        long totalCorretas = quizAttemptRepository.countByUsuarioIdAndCorretaTrue(usuarioId);
        double taxaAcerto = totalRespondidas == 0 ? 0.0 : Math.round((totalCorretas * 1000.0) / totalRespondidas) / 10.0;

        long horasEstudadas = (progresso.getTotalMinutosFoco() / 60);

        List<Object[]> agregadoPorTema = quizAttemptRepository.agregarPorTema(usuarioId);
        List<EstatisticaPorTema> porTema = agregadoPorTema.stream()
                .map(linha -> {
                    String tema = (String) linha[0];
                    long total = ((Number) linha[1]).longValue();
                    long corretas = ((Number) linha[2]).longValue();
                    double taxa = total == 0 ? 0.0 : Math.round((corretas * 1000.0) / total) / 10.0;
                    return new EstatisticaPorTema(tema, total, corretas, taxa);
                })
                .toList();

        List<EstatisticaPorTema> maisEstudadas = porTema.stream()
                .sorted(Comparator.comparingLong(EstatisticaPorTema::totalRespondidas).reversed())
                .limit(5)
                .toList();

        List<EstatisticaPorTema> menosEstudadas = porTema.stream()
                .sorted(Comparator.comparingLong(EstatisticaPorTema::totalRespondidas))
                .limit(5)
                .toList();

        List<QuizAttempt> tentativas = quizAttemptRepository.findByUsuarioIdAndRespondidaEmBetween(
                usuarioId, LocalDateTime.now().minusMonths(6), LocalDateTime.now());

        return new StatisticsResponse(
                horasEstudadas,
                progresso.getXpTotal(),
                totalRespondidas,
                totalCorretas,
                taxaAcerto,
                streak.getSequenciaAtual(),
                streak.getMaiorSequencia(),
                contarDiasAtivos(tentativas),
                montarXpPorSemana(tentativas),
                montarXpPorMes(tentativas),
                montarAtividadeSemanal(tentativas),
                montarAtividadeMensal(tentativas),
                porTema,
                maisEstudadas,
                menosEstudadas
        );
    }

    private int contarDiasAtivos(List<QuizAttempt> tentativas) {
        return (int) tentativas.stream()
                .map(t -> t.getRespondidaEm().toLocalDate())
                .distinct()
                .count();
    }

    /**
     * XP aproximado por semana, nas últimas 8 semanas, usando o
     * número de respostas corretas/erradas como proxy de XP ganho
     * (10 XP por acerto, 2 XP por erro) — uma aproximação razoável
     * sem precisar de uma tabela de "histórico de XP" dedicada.
     */
    private List<PontoSerieTemporal> montarXpPorSemana(List<QuizAttempt> tentativas) {
        Map<String, Long> porSemana = new LinkedHashMap<>();
        LocalDate hoje = LocalDate.now();

        for (int i = 7; i >= 0; i--) {
            LocalDate inicioSemana = hoje.minusWeeks(i).with(DayOfWeek.MONDAY);
            String rotulo = "Sem " + inicioSemana.format(java.time.format.DateTimeFormatter.ofPattern("dd/MM"));
            porSemana.put(rotulo, 0L);
        }

        for (QuizAttempt tentativa : tentativas) {
            LocalDate data = tentativa.getRespondidaEm().toLocalDate();
            LocalDate inicioSemana = data.with(DayOfWeek.MONDAY);
            String rotulo = "Sem " + inicioSemana.format(java.time.format.DateTimeFormatter.ofPattern("dd/MM"));
            long xp = tentativa.isCorreta() ? 10 : 2;
            porSemana.computeIfPresent(rotulo, (k, v) -> v + xp);
        }

        return porSemana.entrySet().stream()
                .map(e -> new PontoSerieTemporal(e.getKey(), e.getValue()))
                .toList();
    }

    private List<PontoSerieTemporal> montarXpPorMes(List<QuizAttempt> tentativas) {
        Map<String, Long> porMes = new LinkedHashMap<>();
        LocalDate hoje = LocalDate.now();

        for (int i = 5; i >= 0; i--) {
            LocalDate mes = hoje.minusMonths(i);
            String rotulo = capitalizar(mes.getMonth().getDisplayName(TextStyle.SHORT, new Locale("pt", "BR")));
            porMes.put(rotulo, 0L);
        }

        for (QuizAttempt tentativa : tentativas) {
            LocalDate data = tentativa.getRespondidaEm().toLocalDate();
            String rotulo = capitalizar(data.getMonth().getDisplayName(TextStyle.SHORT, new Locale("pt", "BR")));
            long xp = tentativa.isCorreta() ? 10 : 2;
            porMes.computeIfPresent(rotulo, (k, v) -> v + xp);
        }

        return porMes.entrySet().stream()
                .map(e -> new PontoSerieTemporal(e.getKey(), e.getValue()))
                .toList();
    }

    private List<PontoSerieTemporal> montarAtividadeSemanal(List<QuizAttempt> tentativas) {
        String[] diasSemana = {"Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"};
        Map<String, Long> contagem = new LinkedHashMap<>();
        for (String dia : diasSemana) {
            contagem.put(dia, 0L);
        }

        LocalDate hoje = LocalDate.now();
        LocalDate seteDiasAtras = hoje.minusDays(6);

        for (QuizAttempt tentativa : tentativas) {
            LocalDate data = tentativa.getRespondidaEm().toLocalDate();
            if (data.isBefore(seteDiasAtras)) continue;
            String rotulo = diasSemana[data.getDayOfWeek().getValue() - 1];
            contagem.computeIfPresent(rotulo, (k, v) -> v + 1);
        }

        return contagem.entrySet().stream()
                .map(e -> new PontoSerieTemporal(e.getKey(), e.getValue()))
                .toList();
    }

    private List<PontoSerieTemporal> montarAtividadeMensal(List<QuizAttempt> tentativas) {
        Map<Integer, Long> porDiaDoMes = tentativas.stream()
                .filter(t -> t.getRespondidaEm().toLocalDate().getMonth() == LocalDate.now().getMonth())
                .collect(Collectors.groupingBy(t -> t.getRespondidaEm().getDayOfMonth(), Collectors.counting()));

        List<PontoSerieTemporal> resultado = new ArrayList<>();
        int diasNoMes = LocalDate.now().lengthOfMonth();
        for (int dia = 1; dia <= diasNoMes; dia++) {
            resultado.add(new PontoSerieTemporal(String.valueOf(dia), porDiaDoMes.getOrDefault(dia, 0L)));
        }
        return resultado;
    }

    private String capitalizar(String texto) {
        if (texto == null || texto.isBlank()) return texto;
        return texto.substring(0, 1).toUpperCase() + texto.substring(1).replace(".", "");
    }
}
