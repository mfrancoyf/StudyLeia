package com.memora.shop.service;

import com.memora.auth.entity.Usuario;
import com.memora.background.entity.BackgroundTheme;
import com.memora.background.repository.BackgroundThemeRepository;
import com.memora.cosmetic.entity.CategoriaCosmetico;
import com.memora.cosmetic.entity.CosmeticItem;
import com.memora.cosmetic.repository.CosmeticItemRepository;
import com.memora.exception.MoedasInsuficientesException;
import com.memora.gamification.service.GamificationService;
import com.memora.shop.dto.ComprarItemRequest;
import com.memora.shop.entity.Raridade;
import com.memora.shop.entity.TipoItemLoja;
import com.memora.shop.entity.UserInventory;
import com.memora.shop.repository.PurchaseHistoryRepository;
import com.memora.shop.repository.UserInventoryRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("ShopService — catálogo, compras, inventário e equipagem")
class ShopServiceTest {

    @Mock private CosmeticItemRepository cosmeticItemRepository;
    @Mock private BackgroundThemeRepository backgroundThemeRepository;
    @Mock private UserInventoryRepository userInventoryRepository;
    @Mock private PurchaseHistoryRepository purchaseHistoryRepository;
    @Mock private GamificationService gamificationService;

    @InjectMocks
    private ShopService shopService;

    private Usuario usuario;
    private CosmeticItem chapeu;
    private CosmeticItem laco;

    @BeforeEach
    void configurar() {
        usuario = Usuario.builder().id(UUID.randomUUID()).nome("Ana Laura").build();

        chapeu = CosmeticItem.builder()
                .id(UUID.randomUUID())
                .nome("Chapéu de Formatura")
                .categoria(CategoriaCosmetico.CHAPEU)
                .raridade(Raridade.EPICA)
                .preco(300)
                .icone("🎓")
                .ativo(true)
                .build();

        laco = CosmeticItem.builder()
                .id(UUID.randomUUID())
                .nome("Laço Azul Clássico")
                .categoria(CategoriaCosmetico.LACO)
                .raridade(Raridade.COMUM)
                .preco(50)
                .icone("🎀")
                .ativo(true)
                .build();
    }

    @Test
    @DisplayName("Comprar um item novo debita moedas, salva no inventário e registra histórico")
    void comprarItemNovoDebitaMoedasESalvaInventario() {
        var request = new ComprarItemRequest(TipoItemLoja.COSMETICO, chapeu.getId());

        when(userInventoryRepository.existsByUsuarioIdAndTipoItemAndItemRefId(usuario.getId(), TipoItemLoja.COSMETICO, chapeu.getId()))
                .thenReturn(false);
        when(cosmeticItemRepository.findById(chapeu.getId())).thenReturn(Optional.of(chapeu));
        when(gamificationService.saldoDeMoedas(usuario.getId())).thenReturn(200L);

        var resultado = shopService.comprar(usuario, request);

        assertThat(resultado.sucesso()).isTrue();
        assertThat(resultado.nomeItem()).isEqualTo("Chapéu de Formatura");
        assertThat(resultado.precoPago()).isEqualTo(300);
        assertThat(resultado.moedasRestantes()).isEqualTo(200);

        verify(gamificationService).debitarMoedas(usuario, 300);
        verify(userInventoryRepository).save(any(UserInventory.class));
        verify(purchaseHistoryRepository).save(any());
    }

    @Test
    @DisplayName("Comprar um item já possuído lança IllegalStateException sem debitar moedas")
    void comprarItemJaPossuidoLancaExcecao() {
        var request = new ComprarItemRequest(TipoItemLoja.COSMETICO, chapeu.getId());

        when(userInventoryRepository.existsByUsuarioIdAndTipoItemAndItemRefId(usuario.getId(), TipoItemLoja.COSMETICO, chapeu.getId()))
                .thenReturn(true);

        assertThatThrownBy(() -> shopService.comprar(usuario, request))
                .isInstanceOf(IllegalStateException.class);

        verify(gamificationService, never()).debitarMoedas(any(), anyLong());
        verify(userInventoryRepository, never()).save(any());
    }

    @Test
    @DisplayName("Comprar sem moedas suficientes propaga MoedasInsuficientesException e não salva nada")
    void comprarSemMoedasSuficientesPropagaExcecao() {
        var request = new ComprarItemRequest(TipoItemLoja.COSMETICO, chapeu.getId());

        when(userInventoryRepository.existsByUsuarioIdAndTipoItemAndItemRefId(usuario.getId(), TipoItemLoja.COSMETICO, chapeu.getId()))
                .thenReturn(false);
        when(cosmeticItemRepository.findById(chapeu.getId())).thenReturn(Optional.of(chapeu));
        doThrow(new MoedasInsuficientesException("Moedas insuficientes."))
                .when(gamificationService).debitarMoedas(usuario, 300);

        assertThatThrownBy(() -> shopService.comprar(usuario, request))
                .isInstanceOf(MoedasInsuficientesException.class);

        verify(userInventoryRepository, never()).save(any());
        verify(purchaseHistoryRepository, never()).save(any());
    }

    @Test
    @DisplayName("Equipar um cosmético desequipa automaticamente outro item da mesma categoria")
    void equiparCosmeticoDesequipaMesmaCategoria() {
        UserInventory chapeuNoInventario = UserInventory.builder()
                .usuario(usuario).tipoItem(TipoItemLoja.COSMETICO).itemRefId(chapeu.getId()).equipado(false).build();

        UserInventory outroChapeuJaEquipado = UserInventory.builder()
                .usuario(usuario).tipoItem(TipoItemLoja.COSMETICO).itemRefId(UUID.randomUUID()).equipado(true).build();

        CosmeticItem outroChapeu = CosmeticItem.builder()
                .id(outroChapeuJaEquipado.getItemRefId())
                .categoria(CategoriaCosmetico.CHAPEU)
                .build();

        when(userInventoryRepository.findByUsuarioIdAndTipoItemAndItemRefId(usuario.getId(), TipoItemLoja.COSMETICO, chapeu.getId()))
                .thenReturn(Optional.of(chapeuNoInventario));
        when(cosmeticItemRepository.findById(chapeu.getId())).thenReturn(Optional.of(chapeu));
        when(userInventoryRepository.findByUsuarioIdAndTipoItem(usuario.getId(), TipoItemLoja.COSMETICO))
                .thenReturn(List.of(outroChapeuJaEquipado));
        when(cosmeticItemRepository.findById(outroChapeuJaEquipado.getItemRefId())).thenReturn(Optional.of(outroChapeu));

        shopService.equipar(usuario.getId(), TipoItemLoja.COSMETICO, chapeu.getId());

        assertThat(chapeuNoInventario.isEquipado()).isTrue();
        assertThat(outroChapeuJaEquipado.isEquipado()).isFalse();
    }

    @Test
    @DisplayName("Equipar um laço NÃO desequipa um chapéu já equipado (categorias diferentes)")
    void equiparLacoNaoDesequipaChapeu() {
        UserInventory lacoNoInventario = UserInventory.builder()
                .usuario(usuario).tipoItem(TipoItemLoja.COSMETICO).itemRefId(laco.getId()).equipado(false).build();

        UserInventory chapeuJaEquipado = UserInventory.builder()
                .usuario(usuario).tipoItem(TipoItemLoja.COSMETICO).itemRefId(chapeu.getId()).equipado(true).build();

        when(userInventoryRepository.findByUsuarioIdAndTipoItemAndItemRefId(usuario.getId(), TipoItemLoja.COSMETICO, laco.getId()))
                .thenReturn(Optional.of(lacoNoInventario));
        when(cosmeticItemRepository.findById(laco.getId())).thenReturn(Optional.of(laco));
        when(userInventoryRepository.findByUsuarioIdAndTipoItem(usuario.getId(), TipoItemLoja.COSMETICO))
                .thenReturn(List.of(chapeuJaEquipado));
        when(cosmeticItemRepository.findById(chapeu.getId())).thenReturn(Optional.of(chapeu));

        shopService.equipar(usuario.getId(), TipoItemLoja.COSMETICO, laco.getId());

        assertThat(lacoNoInventario.isEquipado()).isTrue();
        assertThat(chapeuJaEquipado.isEquipado()).isTrue(); // permanece equipado — categoria diferente
    }

    @Test
    @DisplayName("Equipar um cenário desequipa qualquer outro cenário (só um por vez)")
    void equiparCenarioDesequipaOutroCenario() {
        UUID novoTemaId = UUID.randomUUID();
        UUID temaAntigoId = UUID.randomUUID();

        UserInventory novoTemaNoInventario = UserInventory.builder()
                .usuario(usuario).tipoItem(TipoItemLoja.CENARIO).itemRefId(novoTemaId).equipado(false).build();

        UserInventory temaAntigoEquipado = UserInventory.builder()
                .usuario(usuario).tipoItem(TipoItemLoja.CENARIO).itemRefId(temaAntigoId).equipado(true).build();

        when(userInventoryRepository.findByUsuarioIdAndTipoItemAndItemRefId(usuario.getId(), TipoItemLoja.CENARIO, novoTemaId))
                .thenReturn(Optional.of(novoTemaNoInventario));
        when(userInventoryRepository.findByUsuarioIdAndTipoItem(usuario.getId(), TipoItemLoja.CENARIO))
                .thenReturn(List.of(temaAntigoEquipado));

        shopService.equipar(usuario.getId(), TipoItemLoja.CENARIO, novoTemaId);

        assertThat(novoTemaNoInventario.isEquipado()).isTrue();
        assertThat(temaAntigoEquipado.isEquipado()).isFalse();
    }

    @Test
    @DisplayName("Listar catálogo combina cosméticos e cenários num único resultado")
    void listarCatalogoCombinaCosmeticosECenarios() {
        BackgroundTheme tema = BackgroundTheme.builder()
                .id(UUID.randomUUID()).nome("Biblioteca").raridade(Raridade.COMUM)
                .preco(100).icone("📚").gradiente("linear-gradient(...)").ativo(true).build();

        when(userInventoryRepository.findByUsuarioId(usuario.getId())).thenReturn(List.of());
        when(cosmeticItemRepository.findByAtivoTrue()).thenReturn(List.of(chapeu, laco));
        when(backgroundThemeRepository.findByAtivoTrue()).thenReturn(List.of(tema));

        var catalogo = shopService.listarCatalogo(usuario.getId());

        assertThat(catalogo).hasSize(3);
        assertThat(catalogo).extracting("tipoItem").containsExactlyInAnyOrder("COSMETICO", "COSMETICO", "CENARIO");
    }
}
