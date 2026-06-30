package com.memora.calendar.service;

import com.memora.auth.entity.Usuario;
import com.memora.calendar.dto.EventRequest;
import com.memora.calendar.dto.EventResponse;
import com.memora.calendar.entity.Event;
import com.memora.calendar.repository.EventRepository;
import com.memora.exception.AcessoNegadoException;
import com.memora.exception.RecursoNaoEncontradoException;
import com.memora.gamification.entity.TipoAtividade;
import com.memora.gamification.service.GamificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;
    private final GamificationService gamificationService;

    @Transactional(readOnly = true)
    public List<EventResponse> listarPorUsuario(UUID usuarioId) {
        return eventRepository.findByUsuarioIdOrderByDataHoraAsc(usuarioId)
                .stream().map(this::toResponse).toList();
    }

    /**
     * Eventos dos próximos 7 dias — usado pelo widget "Próximas
     * provas" do dashboard e pelo alerta de proximidade.
     */
    @Transactional(readOnly = true)
    public List<EventResponse> listarProximosEventos(UUID usuarioId) {
        LocalDateTime agora = LocalDateTime.now();
        return eventRepository.findByUsuarioIdAndDataHoraBetweenOrderByDataHoraAsc(usuarioId, agora, agora.plusDays(7))
                .stream().map(this::toResponse).toList();
    }

    @Transactional
    public EventResponse criar(Usuario usuario, EventRequest request) {
        Event event = Event.builder()
                .usuario(usuario)
                .titulo(request.titulo())
                .tipo(request.tipo())
                .dataHora(request.dataHora())
                .descricao(request.descricao())
                .alertaEnviado(false)
                .build();

        event = eventRepository.save(event);
        gamificationService.concederRecompensa(usuario, TipoAtividade.EVENTO_CALENDARIO_CRIADO);

        log.info("Evento '{}' ({}) criado pelo usuário {} para {}", event.getTitulo(), event.getTipo(), usuario.getId(), event.getDataHora());

        return toResponse(event);
    }

    @Transactional
    public EventResponse atualizar(UUID id, UUID usuarioId, EventRequest request) {
        Event event = buscarEValidarPropriedade(id, usuarioId);
        event.setTitulo(request.titulo());
        event.setTipo(request.tipo());
        event.setDataHora(request.dataHora());
        event.setDescricao(request.descricao());
        return toResponse(eventRepository.save(event));
    }

    @Transactional
    public void excluir(UUID id, UUID usuarioId) {
        Event event = buscarEValidarPropriedade(id, usuarioId);
        eventRepository.delete(event);
    }

    private Event buscarEValidarPropriedade(UUID id, UUID usuarioId) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Evento não encontrado."));
        if (!event.getUsuario().getId().equals(usuarioId)) {
            throw new AcessoNegadoException("Este evento não pertence ao usuário autenticado.");
        }
        return event;
    }

    // ===================== Mapeamento entidade → DTO =====================
    // Feito manualmente (sem MapStruct) por consistência com os demais
    // módulos do projeto que tiveram seus mappers removidos nesta
    // revisão (ver PROJECT_STATUS.md) — nenhum mapper MapStruct
    // permanece no projeto, eliminando por completo o risco de falha
    // de geração de código reportado anteriormente.

    private EventResponse toResponse(Event event) {
        return new EventResponse(
                event.getId(),
                event.getTitulo(),
                event.getTipo(),
                event.getDataHora(),
                event.getDescricao(),
                calcularDiasRestantes(event.getDataHora())
        );
    }

    private long calcularDiasRestantes(LocalDateTime dataHora) {
        return ChronoUnit.DAYS.between(LocalDateTime.now(), dataHora);
    }
}
