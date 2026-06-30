package com.memora.pet.service;

import com.memora.auth.entity.Usuario;
import com.memora.pet.entity.EstagioEvolucao;
import com.memora.pet.entity.HumorPet;
import com.memora.pet.entity.PetStatus;
import com.memora.pet.repository.PetStatusRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;

/**
 * Centraliza toda a lógica de "vida" da Leia: criação do estado
 * inicial para um novo usuário, reação a atividades de estudo
 * (sobe o humor), e o cálculo do estágio de evolução visual a partir
 * do nível de gamificação.
 *
 * Esse serviço é o que dá "alma" ao conceito do produto: a Leia não é
 * só uma imagem estática, ela responde ao comportamento da usuária.
 */
@Service
@RequiredArgsConstructor
public class PetService {

    private final PetStatusRepository petStatusRepository;

    @Transactional
    public PetStatus criarEstadoInicial(Usuario usuario) {
        PetStatus status = PetStatus.builder()
                .usuario(usuario)
                .nomePet(usuario.getNomeDaPet() != null && !usuario.getNomeDaPet().isBlank()
                        ? usuario.getNomeDaPet() : "Leia")
                .humor(HumorPet.FELIZ)
                .estagioEvolucao(EstagioEvolucao.FILHOTE)
                .ultimaInteracaoEm(LocalDateTime.now())
                .totalCarinhos(0)
                .build();
        return petStatusRepository.save(status);
    }

    @Transactional(readOnly = true)
    public PetStatus buscarPorUsuario(java.util.UUID usuarioId) {
        return petStatusRepository.findByUsuarioId(usuarioId)
                .orElseThrow(() -> new com.memora.exception.RecursoNaoEncontradoException(
                        "Estado da Leia não encontrado para este usuário."));
    }

    /**
     * Chamado pelo GamificationService sempre que o usuário ganha XP.
     * Sobe o humor da Leia gradualmente e atualiza o registro de
     * última interação (usado para detectar "abandono" e baixar o
     * humor com o tempo, ver decairHumorPorInatividade).
     */
    @Transactional
    public void reagirAGanhoDeXp(java.util.UUID usuarioId) {
        PetStatus status = buscarPorUsuario(usuarioId);
        status.setHumor(subirHumor(status.getHumor()));
        status.setUltimaInteracaoEm(LocalDateTime.now());
        petStatusRepository.save(status);
    }

    /**
     * Chamado quando a usuária erra uma questão de quiz — a Leia fica
     * só um pouco mais "neutra/desanimada", nunca punitivo demais,
     * para não desencorajar (o tom emocional do produto é de apoio).
     */
    @Transactional
    public void reagirAErro(java.util.UUID usuarioId) {
        PetStatus status = buscarPorUsuario(usuarioId);
        if (status.getHumor() == HumorPet.SUPER_FELIZ || status.getHumor() == HumorPet.FELIZ) {
            status.setHumor(HumorPet.NEUTRA);
        }
        petStatusRepository.save(status);
    }

    @Transactional
    public void registrarCarinho(java.util.UUID usuarioId) {
        PetStatus status = buscarPorUsuario(usuarioId);
        status.setTotalCarinhos(status.getTotalCarinhos() + 1);
        status.setHumor(subirHumor(status.getHumor()));
        status.setUltimaInteracaoEm(LocalDateTime.now());
        petStatusRepository.save(status);
    }

    /**
     * Atualiza o estágio visual de evolução da Leia a partir do nível
     * atual de gamificação do usuário. Retorna true se houve uma
     * evolução de estágio nesta chamada (para o frontend disparar a
     * animação de "metamorfose").
     */
    @Transactional
    public boolean atualizarEstagioEvolucao(java.util.UUID usuarioId, int nivelAtual) {
        PetStatus status = buscarPorUsuario(usuarioId);
        EstagioEvolucao estagioCalculado = calcularEstagioPorNivel(nivelAtual);

        boolean evoluiu = estagioCalculado != status.getEstagioEvolucao()
                && estagioCalculado.ordinal() > status.getEstagioEvolucao().ordinal();

        if (estagioCalculado.ordinal() > status.getEstagioEvolucao().ordinal()) {
            status.setEstagioEvolucao(estagioCalculado);
        }
        petStatusRepository.save(status);
        return evoluiu;
    }

    /**
     * Reduz o humor da Leia gradualmente quando a usuária fica muitas
     * horas sem estudar. Chamado pela tarefa agendada
     * (ver StreakSchedulerJob) — não é uma punição agressiva, é só um
     * empurrãozinho emocional pra ela voltar e "cuidar" da gata.
     */
    @Transactional
    public void decairHumorPorInatividade(PetStatus status) {
        if (status.getUltimaInteracaoEm() == null) {
            return;
        }
        long horasSemInteragir = Duration.between(status.getUltimaInteracaoEm(), LocalDateTime.now()).toHours();

        if (horasSemInteragir >= 48) {
            status.setHumor(HumorPet.TRISTE);
        } else if (horasSemInteragir >= 24) {
            status.setHumor(HumorPet.ENTEDIADA);
        }
        petStatusRepository.save(status);
    }

    private HumorPet subirHumor(HumorPet atual) {
        return switch (atual) {
            case TRISTE -> HumorPet.NEUTRA;
            case ENTEDIADA -> HumorPet.FELIZ;
            case NEUTRA -> HumorPet.FELIZ;
            case FELIZ -> HumorPet.SUPER_FELIZ;
            case SUPER_FELIZ -> HumorPet.SUPER_FELIZ;
        };
    }

    private EstagioEvolucao calcularEstagioPorNivel(int nivel) {
        if (nivel >= 30) return EstagioEvolucao.RAINHA_LEIA;
        if (nivel >= 20) return EstagioEvolucao.SABIA;
        if (nivel >= 10) return EstagioEvolucao.ADULTA;
        if (nivel >= 5) return EstagioEvolucao.JOVEM;
        return EstagioEvolucao.FILHOTE;
    }
}
