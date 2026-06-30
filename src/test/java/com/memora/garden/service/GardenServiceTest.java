package com.memora.garden.service;

import com.memora.auth.entity.Usuario;
import com.memora.exception.AcessoNegadoException;
import com.memora.gamification.service.GamificationService;
import com.memora.garden.dto.PlantarRequest;
import com.memora.garden.entity.EstagioCrescimento;
import com.memora.garden.entity.Garden;
import com.memora.garden.entity.TipoPlanta;
import com.memora.garden.entity.UserPlant;
import com.memora.garden.repository.GardenRepository;
import com.memora.garden.repository.UserPlantRepository;
import com.memora.gamification.entity.UserProgress;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("GardenService — sementes, plantio e crescimento combinado (tempo + XP + metas)")
class GardenServiceTest {

    @Mock private GardenRepository gardenRepository;
    @Mock private UserPlantRepository userPlantRepository;
    @Mock private GamificationService gamificationService;

    @InjectMocks
    private GardenService gardenService;

    private Usuario usuario;
    private Garden garden;
    private UserProgress progresso;

    @BeforeEach
    void configurar() {
        usuario = Usuario.builder().id(UUID.randomUUID()).nome("Ana Laura").build();
        garden = Garden.builder().id(UUID.randomUUID()).usuario(usuario).sementes(20).totalFloresColhidas(0).build();
        progresso = UserProgress.builder().usuario(usuario).xpTotal(0).totalQuizzesRespondidos(0).totalPlanosConcluidos(0).build();

        when(gardenRepository.findByUsuarioId(usuario.getId())).thenReturn(Optional.of(garden));
        when(gardenRepository.save(any(Garden.class))).thenAnswer(inv -> inv.getArgument(0));
        when(userPlantRepository.save(any(UserPlant.class))).thenAnswer(inv -> inv.getArgument(0));
    }

    @Test
    @DisplayName("Plantar consome sementes do saldo e cria a planta com snapshot de XP/metas do momento")
    void plantarConsomeSementesECriaPlantaComSnapshot() {
        progresso.setXpTotal(120);
        progresso.setTotalQuizzesRespondidos(3);
        when(gamificationService.buscarPorUsuario(usuario.getId())).thenReturn(progresso);
        when(userPlantRepository.findByGardenId(garden.getId())).thenReturn(List.of());

        var request = new PlantarRequest(TipoPlanta.FLOR_AZUL, 0); // custo 5 sementes

        var resposta = gardenService.plantar(usuario, request);

        assertThat(garden.getSementes()).isEqualTo(15); // 20 - 5
        assertThat(resposta.tipo()).isEqualTo("FLOR_AZUL");
        assertThat(resposta.posicaoVaso()).isZero();
        assertThat(resposta.colhida()).isFalse();
    }

    @Test
    @DisplayName("Plantar sem sementes suficientes lança IllegalStateException e não debita nada")
    void plantarSemSementesSuficientesLancaExcecao() {
        garden.setSementes(2); // menos que o custo de qualquer planta
        when(userPlantRepository.findByGardenId(garden.getId())).thenReturn(List.of());

        var request = new PlantarRequest(TipoPlanta.LAVANDA, 0); // custo 12 sementes

        assertThatThrownBy(() -> gardenService.plantar(usuario, request))
                .isInstanceOf(IllegalStateException.class);

        assertThat(garden.getSementes()).isEqualTo(2); // saldo intacto
        verify(gardenRepository, never()).save(any());
    }

    @Test
    @DisplayName("Plantar num vaso já ocupado por planta não colhida lança IllegalStateException")
    void plantarEmVasoOcupadoLancaExcecao() {
        UserPlant plantaExistente = UserPlant.builder()
                .garden(garden).posicaoVaso(3).tipo(TipoPlanta.ROSA).colhida(false).build();

        when(userPlantRepository.findByGardenId(garden.getId())).thenReturn(List.of(plantaExistente));

        var request = new PlantarRequest(TipoPlanta.GIRASSOL, 3);

        assertThatThrownBy(() -> gardenService.plantar(usuario, request))
                .isInstanceOf(IllegalStateException.class);
    }

    @Test
    @DisplayName("Plantar no mesmo vaso de uma planta JÁ COLHIDA é permitido (vaso libera após colheita)")
    void plantarEmVasoDePlantaJaColhidaEPermitido() {
        UserPlant plantaColhida = UserPlant.builder()
                .garden(garden).posicaoVaso(3).tipo(TipoPlanta.ROSA).colhida(true).build();

        when(userPlantRepository.findByGardenId(garden.getId())).thenReturn(List.of(plantaColhida));
        when(gamificationService.buscarPorUsuario(usuario.getId())).thenReturn(progresso);

        var request = new PlantarRequest(TipoPlanta.GIRASSOL, 3);

        var resposta = gardenService.plantar(usuario, request);

        assertThat(resposta.posicaoVaso()).isEqualTo(3);
    }

    @Test
    @DisplayName("Colher uma planta floresceu marca como colhida e incrementa o total de flores colhidas")
    void colherPlantaFlorescidaIncrementaTotal() {
        UserPlant plantaFlorescida = UserPlant.builder()
                .id(UUID.randomUUID()).garden(garden).tipo(TipoPlanta.ROSA)
                .estagio(EstagioCrescimento.FLORESCIDA).colhida(false).build();

        when(userPlantRepository.findById(plantaFlorescida.getId())).thenReturn(Optional.of(plantaFlorescida));

        gardenService.colher(usuario.getId(), plantaFlorescida.getId());

        assertThat(plantaFlorescida.isColhida()).isTrue();
        assertThat(garden.getTotalFloresColhidas()).isEqualTo(1);
    }

    @Test
    @DisplayName("Colher uma planta que ainda não floresceu lança IllegalStateException")
    void colherPlantaAindaNaoFlorescidaLancaExcecao() {
        UserPlant plantaCrescendo = UserPlant.builder()
                .id(UUID.randomUUID()).garden(garden).tipo(TipoPlanta.ROSA)
                .estagio(EstagioCrescimento.CRESCENDO).colhida(false).build();

        when(userPlantRepository.findById(plantaCrescendo.getId())).thenReturn(Optional.of(plantaCrescendo));

        assertThatThrownBy(() -> gardenService.colher(usuario.getId(), plantaCrescendo.getId()))
                .isInstanceOf(IllegalStateException.class);
    }

    @Test
    @DisplayName("Colher uma planta de outro jardim lança AcessoNegadoException")
    void colherPlantaDeOutroJardimLancaAcessoNegado() {
        Garden outroJardim = Garden.builder().id(UUID.randomUUID()).build();
        UserPlant plantaDeOutroJardim = UserPlant.builder()
                .id(UUID.randomUUID()).garden(outroJardim).tipo(TipoPlanta.ROSA)
                .estagio(EstagioCrescimento.FLORESCIDA).colhida(false).build();

        when(userPlantRepository.findById(plantaDeOutroJardim.getId())).thenReturn(Optional.of(plantaDeOutroJardim));

        assertThatThrownBy(() -> gardenService.colher(usuario.getId(), plantaDeOutroJardim.getId()))
                .isInstanceOf(AcessoNegadoException.class);
    }

    @Test
    @DisplayName("Planta recém-plantada (sem tempo, XP ou metas) fica no estágio SEMENTE ao recalcular")
    void plantaRecenPlantadaFicaNoEstagioSemente() {
        UserPlant plantaNova = UserPlant.builder()
                .garden(garden).tipo(TipoPlanta.FLOR_AZUL)
                .plantadaEm(LocalDateTime.now())
                .xpNoPlantio(0).metasConcluidasNoPlantio(0)
                .estagio(EstagioCrescimento.SEMENTE).colhida(false).build();

        when(gamificationService.buscarPorUsuario(usuario.getId())).thenReturn(progresso);
        when(userPlantRepository.findByGardenIdAndColhidaFalse(garden.getId())).thenReturn(List.of(plantaNova));

        gardenService.obterJardim(usuario.getId());

        assertThat(plantaNova.getEstagio()).isEqualTo(EstagioCrescimento.SEMENTE);
    }

    @Test
    @DisplayName("Planta com tempo, XP e metas suficientes avança para FLORESCIDA")
    void plantaComTodosOsFatoresCompletosFlorescePlenamente() {
        // FLOR_AZUL: diasParaFlorescer=3, custoSementes=5 -> precisa de
        // 72h decorridas, 100 XP ganho (5*20) e 3 metas concluídas para 100%.
        UserPlant plantaMadura = UserPlant.builder()
                .garden(garden).tipo(TipoPlanta.FLOR_AZUL)
                .plantadaEm(LocalDateTime.now().minusDays(4)) // mais que os 3 dias necessários
                .xpNoPlantio(0).metasConcluidasNoPlantio(0)
                .estagio(EstagioCrescimento.SEMENTE).colhida(false).build();

        progresso.setXpTotal(150); // mais que o suficiente (100 XP necessário)
        progresso.setTotalQuizzesRespondidos(5); // mais que as 3 metas necessárias

        when(gamificationService.buscarPorUsuario(usuario.getId())).thenReturn(progresso);
        when(userPlantRepository.findByGardenIdAndColhidaFalse(garden.getId())).thenReturn(List.of(plantaMadura));

        gardenService.obterJardim(usuario.getId());

        assertThat(plantaMadura.getEstagio()).isEqualTo(EstagioCrescimento.FLORESCIDA);
    }

    @Test
    @DisplayName("Planta com aproximadamente metade do progresso combinado fica no estágio BROTO ou CRESCENDO")
    void plantaComProgressoParcialFicaEmEstagioIntermediario() {
        // Apenas o fator tempo está parcialmente satisfeito (50% do prazo);
        // XP e metas ainda zerados — progresso combinado ~16.6%, então BROTO.
        UserPlant plantaParcial = UserPlant.builder()
                .garden(garden).tipo(TipoPlanta.FLOR_AZUL)
                .plantadaEm(LocalDateTime.now().minusHours(36)) // metade de 72h
                .xpNoPlantio(0).metasConcluidasNoPlantio(0)
                .estagio(EstagioCrescimento.SEMENTE).colhida(false).build();

        when(gamificationService.buscarPorUsuario(usuario.getId())).thenReturn(progresso);
        when(userPlantRepository.findByGardenIdAndColhidaFalse(garden.getId())).thenReturn(List.of(plantaParcial));

        gardenService.obterJardim(usuario.getId());

        assertThat(plantaParcial.getEstagio()).isIn(EstagioCrescimento.SEMENTE, EstagioCrescimento.BROTO);
    }

    @Test
    @DisplayName("creditarSementesPorEstudo incrementa o saldo de sementes do jardim do usuário")
    void creditarSementesPorEstudoIncrementaSaldo() {
        garden.setSementes(10);

        gardenService.creditarSementesPorEstudo(usuario.getId());

        assertThat(garden.getSementes()).isEqualTo(11);
    }

    @Test
    @DisplayName("creditarSementesPorEstudo não falha se o usuário não tiver jardim provisionado")
    void creditarSementesParaUsuarioSemJardimNaoFalha() {
        UUID usuarioSemJardim = UUID.randomUUID();
        when(gardenRepository.findByUsuarioId(usuarioSemJardim)).thenReturn(Optional.empty());

        gardenService.creditarSementesPorEstudo(usuarioSemJardim); // não deve lançar exceção

        verify(gardenRepository, never()).save(any());
    }
}
