package com.memora.garden.service;

import com.memora.auth.entity.Usuario;
import com.memora.exception.RecursoNaoEncontradoException;
import com.memora.garden.dto.GardenResponse;
import com.memora.garden.dto.PlantaResponse;
import com.memora.garden.dto.PlantarRequest;
import com.memora.garden.entity.EstagioCrescimento;
import com.memora.garden.entity.Garden;
import com.memora.garden.entity.TipoPlanta;
import com.memora.garden.entity.UserPlant;
import com.memora.garden.repository.GardenRepository;
import com.memora.garden.repository.UserPlantRepository;
import com.memora.gamification.entity.UserProgress;
import com.memora.gamification.event.RecompensaConcedidaEvent;
import com.memora.gamification.service.GamificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

/**
 * O Jardim é o módulo mais "emocional" depois da própria Leia: cada
 * planta cresce conforme três fatores combinados — tempo desde o
 * plantio, XP ganho nesse período e metas concluídas nesse período.
 * Isso faz o jardim florescer mais rápido para quem está realmente
 * estudando, em vez de ser um simples timer.
 *
 * Sementes são ganhas como subproduto de qualquer recompensa de
 * gamificação (ver GamificationListener / chamada feita pelos demais
 * services) — aqui o GardenService só expõe `creditarSemente`, que é
 * chamado a partir do fluxo de recompensa.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class GardenService {

    private static final long SEMENTES_POR_RECOMPENSA = 1;

    private final GardenRepository gardenRepository;
    private final UserPlantRepository userPlantRepository;
    private final GamificationService gamificationService;

    @Transactional
    public Garden criarParaUsuario(Usuario usuario) {
        Garden garden = Garden.builder()
                .usuario(usuario)
                .sementes(10)
                .totalFloresColhidas(0)
                .build();
        return gardenRepository.save(garden);
    }

    @Transactional(readOnly = true)
    public Garden buscarPorUsuario(UUID usuarioId) {
        return gardenRepository.findByUsuarioId(usuarioId)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Jardim não encontrado para este usuário."));
    }

    @Transactional
    public GardenResponse obterJardim(UUID usuarioId) {
        Garden garden = buscarPorUsuario(usuarioId);
        atualizarEstagiosDeCrescimento(garden, usuarioId);

        List<PlantaResponse> plantas = userPlantRepository.findByGardenId(garden.getId())
                .stream().map(this::toResponse).toList();

        return new GardenResponse(garden.getSementes(), garden.getTotalFloresColhidas(), plantas);
    }

    /**
     * Recalcula o estágio de crescimento de TODAS as plantas ativas de
     * TODOS os jardins — usado pelo job agendado (ver
     * GardenSchedulerJob) para que uma planta possa florescer mesmo
     * que a usuária não tenha aberto o app. obterJardim() já faz esse
     * recálculo sob demanda para um único jardim; este método existe
     * só para o caso de atualização proativa em lote.
     */
    @Transactional
    public int recalcularTodosOsJardins() {
        int processados = 0;
        for (Garden garden : gardenRepository.findAll()) {
            atualizarEstagiosDeCrescimento(garden, garden.getUsuario().getId());
            processados++;
        }
        return processados;
    }

    @Transactional
    public PlantaResponse plantar(Usuario usuario, PlantarRequest request) {
        Garden garden = buscarPorUsuario(usuario.getId());

        boolean vasoOcupado = userPlantRepository.findByGardenId(garden.getId()).stream()
                .anyMatch(p -> p.getPosicaoVaso() == request.posicaoVaso() && !p.isColhida());
        if (vasoOcupado) {
            throw new IllegalStateException("Já existe uma planta neste vasinho.");
        }

        if (garden.getSementes() < request.tipo().getCustoSementes()) {
            throw new IllegalStateException("Sementes insuficientes para plantar " + request.tipo().getNomeExibicao() + ".");
        }

        UserProgress progresso = gamificationService.buscarPorUsuario(usuario.getId());

        garden.setSementes(garden.getSementes() - request.tipo().getCustoSementes());
        gardenRepository.save(garden);

        UserPlant planta = UserPlant.builder()
                .garden(garden)
                .posicaoVaso(request.posicaoVaso())
                .tipo(request.tipo())
                .estagio(EstagioCrescimento.SEMENTE)
                .xpNoPlantio(progresso.getXpTotal())
                .metasConcluidasNoPlantio(metasAcumuladas(progresso))
                .colhida(false)
                .build();

        planta = userPlantRepository.save(planta);
        log.info("Usuário {} plantou {} no vaso {}", usuario.getId(), request.tipo(), request.posicaoVaso());

        return toResponse(planta);
    }

    @Transactional
    public void colher(UUID usuarioId, UUID plantaId) {
        Garden garden = buscarPorUsuario(usuarioId);

        UserPlant planta = userPlantRepository.findById(plantaId)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Planta não encontrada."));

        if (!planta.getGarden().getId().equals(garden.getId())) {
            throw new com.memora.exception.AcessoNegadoException("Esta planta não pertence ao seu jardim.");
        }

        if (planta.getEstagio() != EstagioCrescimento.FLORESCIDA) {
            throw new IllegalStateException("Esta planta ainda não floresceu.");
        }

        planta.setColhida(true);
        userPlantRepository.save(planta);

        garden.setTotalFloresColhidas(garden.getTotalFloresColhidas() + 1);
        gardenRepository.save(garden);
    }

    /**
     * Credita sementes ao jardim do usuário — chamado pelos demais
     * services (quiz, notes, studyplan, focus) imediatamente após
     * uma recompensa de gamificação ser concedida, como um subproduto
     * natural de estudar.
     */
    /**
     * Escuta o evento publicado pelo GamificationService toda vez que
     * uma recompensa é concedida, creditando sementes automaticamente
     * — assim o Jardim cresce como subproduto natural do estudo, sem
     * o GamificationService precisar conhecer o módulo garden
     * diretamente (evita dependência circular entre módulos).
     */
    @EventListener
    @Transactional
    public void aoConcederRecompensa(RecompensaConcedidaEvent evento) {
        creditarSementesPorEstudo(evento.usuarioId());
    }

    @Transactional
    public void creditarSementesPorEstudo(UUID usuarioId) {
        gardenRepository.findByUsuarioId(usuarioId).ifPresent(garden -> {
            garden.setSementes(garden.getSementes() + SEMENTES_POR_RECOMPENSA);
            gardenRepository.save(garden);
        });
    }

    private void atualizarEstagiosDeCrescimento(Garden garden, UUID usuarioId) {
        UserProgress progresso = gamificationService.buscarPorUsuario(usuarioId);
        long xpAtual = progresso.getXpTotal();
        long metasAtuais = metasAcumuladas(progresso);

        List<UserPlant> plantasAtivas = userPlantRepository.findByGardenIdAndColhidaFalse(garden.getId());

        for (UserPlant planta : plantasAtivas) {
            EstagioCrescimento novoEstagio = calcularEstagio(planta, xpAtual, metasAtuais);
            if (novoEstagio != planta.getEstagio()) {
                planta.setEstagio(novoEstagio);
                userPlantRepository.save(planta);
            }
        }
    }

    /**
     * Combina os três fatores de crescimento numa pontuação de 0 a 1
     * (percentualCombinado) e mapeia para um estágio visual. Cada
     * fator contribui igualmente (1/3): tempo decorrido, XP ganho
     * desde o plantio, e metas concluídas desde o plantio.
     */
    private EstagioCrescimento calcularEstagio(UserPlant planta, long xpAtual, long metasAtuais) {
        double percentual = calcularProgressoPercentual(planta, xpAtual, metasAtuais);

        if (percentual >= 1.0) return EstagioCrescimento.FLORESCIDA;
        if (percentual >= 0.66) return EstagioCrescimento.CRESCENDO;
        if (percentual >= 0.33) return EstagioCrescimento.BROTO;
        return EstagioCrescimento.SEMENTE;
    }

    private double calcularProgressoPercentual(UserPlant planta, long xpAtual, long metasAtuais) {
        TipoPlanta tipo = planta.getTipo();

        long horasDecorridas = Duration.between(planta.getPlantadaEm(), LocalDateTime.now()).toHours();
        double progressoTempo = Math.min(1.0, horasDecorridas / (double) (tipo.getDiasParaFlorescer() * 24));

        long xpGanho = Math.max(0, xpAtual - planta.getXpNoPlantio());
        double progressoXp = Math.min(1.0, xpGanho / (double) (tipo.getCustoSementes() * 20));

        long metasGanhas = Math.max(0, metasAtuais - planta.getMetasConcluidasNoPlantio());
        double progressoMetas = Math.min(1.0, metasGanhas / 3.0);

        return (progressoTempo + progressoXp + progressoMetas) / 3.0;
    }

    private long metasAcumuladas(UserProgress progresso) {
        return progresso.getTotalQuizzesRespondidos() + progresso.getTotalPlanosConcluidos();
    }

    private PlantaResponse toResponse(UserPlant planta) {
        UserProgress progresso = gamificationService.buscarPorUsuario(planta.getGarden().getUsuario().getId());
        double percentual = calcularProgressoPercentual(planta, progresso.getXpTotal(), metasAcumuladas(progresso));

        return new PlantaResponse(
                planta.getId(),
                planta.getPosicaoVaso(),
                planta.getTipo().name(),
                planta.getTipo().getNomeExibicao(),
                planta.getEstagio().name(),
                Math.round(percentual * 1000) / 10.0,
                planta.isColhida()
        );
    }
}
