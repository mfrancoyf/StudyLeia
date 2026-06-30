package com.memora.notes.service;

import com.memora.auth.entity.Usuario;
import com.memora.dailymission.entity.TipoMissaoDiaria;
import com.memora.dailymission.service.DailyMissionService;
import com.memora.exception.AcessoNegadoException;
import com.memora.exception.RecursoNaoEncontradoException;
import com.memora.gamification.entity.TipoAtividade;
import com.memora.gamification.service.GamificationService;
import com.memora.notes.dto.NoteRequest;
import com.memora.notes.dto.NoteResponse;
import com.memora.notes.entity.Note;
import com.memora.notes.repository.NoteRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class NoteService {

    private final NoteRepository noteRepository;
    private final GamificationService gamificationService;
    private final DailyMissionService dailyMissionService;

    @Transactional(readOnly = true)
    public List<NoteResponse> listarPorUsuario(UUID usuarioId) {
        return noteRepository.findByUsuarioIdOrderByAtualizadoEmDesc(usuarioId)
                .stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public NoteResponse buscarPorId(UUID id, UUID usuarioId) {
        Note note = buscarEValidarPropriedade(id, usuarioId);
        return toResponse(note);
    }

    @Transactional
    public NoteResponse criar(Usuario usuario, NoteRequest request) {
        Note note = Note.builder()
                .usuario(usuario)
                .titulo(request.titulo())
                .conteudo(request.conteudo())
                .categoria(request.categoria())
                .tags(request.tags() != null ? String.join(",", request.tags()) : null)
                .build();

        note = noteRepository.save(note);
        gamificationService.concederRecompensa(usuario, TipoAtividade.ANOTACAO_CRIADA);
        dailyMissionService.incrementarProgresso(usuario, TipoMissaoDiaria.CRIAR_1_ANOTACAO, 1);

        log.info("Anotação '{}' criada pelo usuário {}", note.getTitulo(), usuario.getId());

        return toResponse(note);
    }

    @Transactional
    public NoteResponse atualizar(UUID id, UUID usuarioId, NoteRequest request) {
        Note note = buscarEValidarPropriedade(id, usuarioId);

        note.setTitulo(request.titulo());
        note.setConteudo(request.conteudo());
        note.setCategoria(request.categoria());
        note.setTags(request.tags() != null ? String.join(",", request.tags()) : null);

        return toResponse(noteRepository.save(note));
    }

    @Transactional
    public void excluir(UUID id, UUID usuarioId) {
        Note note = buscarEValidarPropriedade(id, usuarioId);
        noteRepository.delete(note);
    }

    private Note buscarEValidarPropriedade(UUID id, UUID usuarioId) {
        Note note = noteRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Anotação não encontrada."));
        if (!note.getUsuario().getId().equals(usuarioId)) {
            throw new AcessoNegadoException("Esta anotação não pertence ao usuário autenticado.");
        }
        return note;
    }

    // ===================== Mapeamento entidade → DTO =====================
    // Feito manualmente (sem MapStruct) por consistência com os demais
    // módulos do projeto — nenhum mapper MapStruct permanece no
    // projeto (ver PROJECT_STATUS.md).

    private NoteResponse toResponse(Note note) {
        return new NoteResponse(
                note.getId(),
                note.getTitulo(),
                note.getConteudo(),
                note.getCategoria(),
                dividirTags(note.getTags()),
                note.getCriadoEm(),
                note.getAtualizadoEm()
        );
    }

    private List<String> dividirTags(String tags) {
        if (tags == null || tags.isBlank()) {
            return List.of();
        }
        return Arrays.stream(tags.split(","))
                .map(String::trim)
                .filter(t -> !t.isEmpty())
                .toList();
    }
}
