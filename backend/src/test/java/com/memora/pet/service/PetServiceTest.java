package com.memora.pet.service;

import com.memora.pet.entity.EstagioEvolucao;
import com.memora.pet.entity.HumorPet;
import com.memora.pet.entity.PetStatus;
import com.memora.pet.repository.PetStatusRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@DisplayName("PetService — humor e evolução visual da Leia")
class PetServiceTest {

    @Mock private PetStatusRepository petStatusRepository;

    @InjectMocks
    private PetService petService;

    private UUID usuarioId;
    private PetStatus status;

    @BeforeEach
    void configurar() {
        usuarioId = UUID.randomUUID();
        status = PetStatus.builder()
                .nomePet("Leia")
                .humor(HumorPet.NEUTRA)
                .estagioEvolucao(EstagioEvolucao.FILHOTE)
                .totalCarinhos(0)
                .build();

        when(petStatusRepository.findByUsuarioId(usuarioId)).thenReturn(Optional.of(status));
        when(petStatusRepository.save(any(PetStatus.class))).thenAnswer(inv -> inv.getArgument(0));
    }

    @ParameterizedTest(name = "humor {0} sobe para {1} ao ganhar XP")
    @CsvSource({
            "TRISTE, NEUTRA",
            "ENTEDIADA, FELIZ",
            "NEUTRA, FELIZ",
            "FELIZ, SUPER_FELIZ",
            "SUPER_FELIZ, SUPER_FELIZ",
    })
    @DisplayName("reagirAGanhoDeXp sobe o humor gradualmente, nunca regride")
    void reagirAGanhoDeXpSobeHumorGradualmente(HumorPet humorInicial, HumorPet humorEsperado) {
        status.setHumor(humorInicial);

        petService.reagirAGanhoDeXp(usuarioId);

        assertThat(status.getHumor()).isEqualTo(humorEsperado);
    }

    @Test
    @DisplayName("reagirAErro nunca leva o humor direto a TRISTE — no máximo cai para NEUTRA")
    void reagirAErroNuncaPulaParaOPiorHumor() {
        status.setHumor(HumorPet.SUPER_FELIZ);
        petService.reagirAErro(usuarioId);
        assertThat(status.getHumor()).isEqualTo(HumorPet.NEUTRA);

        status.setHumor(HumorPet.FELIZ);
        petService.reagirAErro(usuarioId);
        assertThat(status.getHumor()).isEqualTo(HumorPet.NEUTRA);
    }

    @Test
    @DisplayName("reagirAErro não altera humor já neutro/triste/entediado (não pune ainda mais)")
    void reagirAErroNaoPioraHumorJaBaixo() {
        status.setHumor(HumorPet.TRISTE);
        petService.reagirAErro(usuarioId);
        assertThat(status.getHumor()).isEqualTo(HumorPet.TRISTE);
    }

    @ParameterizedTest(name = "nível {0} corresponde ao estágio {1}")
    @CsvSource({
            "1, FILHOTE",
            "4, FILHOTE",
            "5, JOVEM",
            "9, JOVEM",
            "10, ADULTA",
            "19, ADULTA",
            "20, SABIA",
            "29, SABIA",
            "30, RAINHA_LEIA",
            "50, RAINHA_LEIA",
    })
    @DisplayName("atualizarEstagioEvolucao mapeia corretamente nível para estágio")
    void atualizarEstagioEvolucaoMapeiaNivelParaEstagio(int nivel, EstagioEvolucao estagioEsperado) {
        status.setEstagioEvolucao(EstagioEvolucao.FILHOTE);

        petService.atualizarEstagioEvolucao(usuarioId, nivel);

        assertThat(status.getEstagioEvolucao()).isEqualTo(estagioEsperado);
    }

    @Test
    @DisplayName("atualizarEstagioEvolucao retorna true apenas quando o estágio realmente avança")
    void atualizarEstagioEvolucaoRetornaTrueSoQuandoAvanca() {
        status.setEstagioEvolucao(EstagioEvolucao.FILHOTE);
        boolean evoluiuPara5 = petService.atualizarEstagioEvolucao(usuarioId, 5);
        assertThat(evoluiuPara5).isTrue();

        boolean evoluiuPara7 = petService.atualizarEstagioEvolucao(usuarioId, 7); // ainda JOVEM, não muda
        assertThat(evoluiuPara7).isFalse();
    }

    @Test
    @DisplayName("atualizarEstagioEvolucao nunca regride o estágio mesmo se o nível cair")
    void atualizarEstagioEvolucaoNuncaRegride() {
        status.setEstagioEvolucao(EstagioEvolucao.ADULTA);

        petService.atualizarEstagioEvolucao(usuarioId, 2); // nível baixo não deveria voltar a FILHOTE

        assertThat(status.getEstagioEvolucao()).isEqualTo(EstagioEvolucao.ADULTA);
    }

    @Test
    @DisplayName("decairHumorPorInatividade não altera nada se nunca houve interação registrada")
    void decairHumorSemInteracaoRegistradaNaoAltera() {
        status.setUltimaInteracaoEm(null);
        status.setHumor(HumorPet.FELIZ);

        petService.decairHumorPorInatividade(status);

        assertThat(status.getHumor()).isEqualTo(HumorPet.FELIZ);
    }

    @Test
    @DisplayName("decairHumorPorInatividade baixa para ENTEDIADA após 24h sem interação")
    void decairHumorApos24HorasFicaEntediada() {
        status.setUltimaInteracaoEm(LocalDateTime.now().minusHours(25));
        status.setHumor(HumorPet.SUPER_FELIZ);

        petService.decairHumorPorInatividade(status);

        assertThat(status.getHumor()).isEqualTo(HumorPet.ENTEDIADA);
    }

    @Test
    @DisplayName("decairHumorPorInatividade baixa para TRISTE após 48h sem interação")
    void decairHumorApos48HorasFicaTriste() {
        status.setUltimaInteracaoEm(LocalDateTime.now().minusHours(50));
        status.setHumor(HumorPet.SUPER_FELIZ);

        petService.decairHumorPorInatividade(status);

        assertThat(status.getHumor()).isEqualTo(HumorPet.TRISTE);
    }

    @Test
    @DisplayName("decairHumorPorInatividade não altera o humor se a interação foi recente (menos de 24h)")
    void decairHumorComInteracaoRecenteNaoAltera() {
        status.setUltimaInteracaoEm(LocalDateTime.now().minusHours(2));
        status.setHumor(HumorPet.FELIZ);

        petService.decairHumorPorInatividade(status);

        assertThat(status.getHumor()).isEqualTo(HumorPet.FELIZ);
    }

    @Test
    @DisplayName("registrarCarinho incrementa o contador de carinhos e sobe o humor")
    void registrarCarinhoIncrementaContadorESobeHumor() {
        status.setTotalCarinhos(3);
        status.setHumor(HumorPet.NEUTRA);

        petService.registrarCarinho(usuarioId);

        assertThat(status.getTotalCarinhos()).isEqualTo(4);
        assertThat(status.getHumor()).isEqualTo(HumorPet.FELIZ);
    }
}
