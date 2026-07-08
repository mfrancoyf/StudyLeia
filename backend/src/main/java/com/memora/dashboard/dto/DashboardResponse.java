package com.memora.dashboard.dto;

import com.memora.calendar.dto.EventResponse;
import com.memora.dailymission.dto.DailyMissionResponse;
import com.memora.gamification.dto.ProgressoResponse;
import com.memora.pet.dto.PetStatusResponse;

import java.util.List;

public record DashboardResponse(
        String saudacao,
        String nomeUsuario,
        PetStatusResponse pet,
        ProgressoResponse progresso,
        List<EventResponse> proximosEventos,
        List<DailyMissionResponse> missoesDoDia
) {
}
