package com.memora.dashboard.service;

import com.memora.auth.entity.Usuario;
import com.memora.calendar.service.EventService;
import com.memora.dailymission.service.DailyMissionService;
import com.memora.dashboard.dto.DashboardResponse;
import com.memora.gamification.service.GamificationService;
import com.memora.pet.dto.PetStatusResponse;
import com.memora.pet.entity.PetStatus;
import com.memora.pet.service.PetService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalTime;

/**
 * Agrega informações de vários módulos (gamification, pet, calendar,
 * dailymission) num único payload, pensado para a primeira
 * renderização do Dashboard — evita que o frontend precise disparar
 * 4-5 chamadas separadas só para montar a tela inicial.
 */
@Service
@RequiredArgsConstructor
public class DashboardService {

    private final GamificationService gamificationService;
    private final PetService petService;
    private final EventService eventService;
    private final DailyMissionService dailyMissionService;

    @Transactional(readOnly = true)
    public DashboardResponse montarDashboard(Usuario usuario) {
        PetStatus petStatus = petService.buscarPorUsuario(usuario.getId());

        return new DashboardResponse(
                montarSaudacao(usuario.getNome()),
                usuario.getNome(),
                new PetStatusResponse(
                        petStatus.getNomePet(),
                        petStatus.getHumor().name(),
                        petStatus.getEstagioEvolucao().name(),
                        petStatus.getTotalCarinhos()
                ),
                gamificationService.obterProgressoCompleto(usuario.getId()),
                eventService.listarProximosEventos(usuario.getId()),
                dailyMissionService.obterMissoesDoDia(usuario)
        );
    }

    private String montarSaudacao(String nome) {
        int hora = LocalTime.now().getHour();
        String primeiroNome = nome.split(" ")[0];

        String periodo = hora < 12 ? "Bom dia" : hora < 18 ? "Boa tarde" : "Boa noite";
        return periodo + ", " + primeiroNome + "!";
    }
}
