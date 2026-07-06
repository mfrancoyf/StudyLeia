package com.memora.shop.service;

import com.memora.auth.entity.Usuario;
import com.memora.background.entity.BackgroundTheme;
import com.memora.background.repository.BackgroundThemeRepository;
import com.memora.cosmetic.entity.CosmeticItem;
import com.memora.cosmetic.repository.CosmeticItemRepository;
import com.memora.exception.RecursoNaoEncontradoException;
import com.memora.gamification.service.GamificationService;
import com.memora.shop.dto.*;
import com.memora.shop.entity.PurchaseHistory;
import com.memora.shop.entity.TipoItemLoja;
import com.memora.shop.entity.UserInventory;
import com.memora.shop.repository.PurchaseHistoryRepository;
import com.memora.shop.repository.UserInventoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Orquestra o catálogo combinado da loja (cosméticos + cenários),
 * compras (debitando moedas via GamificationService), inventário e
 * equipagem. Os catálogos em si (CosmeticItem, BackgroundTheme) são
 * conteúdo estático mantido pelos módulos `cosmetic`/`background`;
 * o Shop é a camada "comercial" por cima deles.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ShopService {

    private final CosmeticItemRepository cosmeticItemRepository;
    private final BackgroundThemeRepository backgroundThemeRepository;
    private final UserInventoryRepository userInventoryRepository;
    private final PurchaseHistoryRepository purchaseHistoryRepository;
    private final GamificationService gamificationService;

    @Transactional(readOnly = true)
    public List<ItemLojaResponse> listarCatalogo(UUID usuarioId) {
        List<UserInventory> inventario = userInventoryRepository.findByUsuarioId(usuarioId);
        Set<UUID> possuidos = inventario.stream().map(UserInventory::getItemRefId).collect(Collectors.toSet());
        Set<UUID> equipados = inventario.stream().filter(UserInventory::isEquipado).map(UserInventory::getItemRefId).collect(Collectors.toSet());

        List<ItemLojaResponse> catalogo = new java.util.ArrayList<>();

        for (CosmeticItem item : cosmeticItemRepository.findByAtivoTrue()) {
            catalogo.add(new ItemLojaResponse(
                    item.getId(), TipoItemLoja.COSMETICO.name(), item.getNome(), item.getDescricao(),
                    item.getCategoria().name(), item.getRaridade().name(), item.getPreco(), item.getIcone(), null, null,
                    possuidos.contains(item.getId()), equipados.contains(item.getId())
            ));
        }

        for (BackgroundTheme tema : backgroundThemeRepository.findByAtivoTrue()) {
            catalogo.add(new ItemLojaResponse(
                    tema.getId(), TipoItemLoja.CENARIO.name(), tema.getNome(), tema.getDescricao(),
                    "CENARIO", tema.getRaridade().name(), tema.getPreco(), tema.getIcone(), tema.getGradiente(),
                    tema.getCodigoCena(),
                    possuidos.contains(tema.getId()), equipados.contains(tema.getId())
            ));
        }

        return catalogo;
    }

    @Transactional(readOnly = true)
    public List<InventoryItemResponse> listarInventario(UUID usuarioId) {
        return userInventoryRepository.findByUsuarioId(usuarioId).stream()
                .map(inv -> new InventoryItemResponse(
                        inv.getItemRefId(),
                        inv.getTipoItem().name(),
                        nomeDoItem(inv.getTipoItem(), inv.getItemRefId()),
                        iconeDoItem(inv.getTipoItem(), inv.getItemRefId()),
                        posicaoOverlayDoItem(inv.getTipoItem(), inv.getItemRefId()),
                        gradienteDoItem(inv.getTipoItem(), inv.getItemRefId()),
                        codigoCenaDoItem(inv.getTipoItem(), inv.getItemRefId()),
                        inv.isEquipado()
                ))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<PurchaseHistoryResponse> listarHistorico(UUID usuarioId) {
        return purchaseHistoryRepository.findByUsuarioIdOrderByCompradoEmDesc(usuarioId)
                .stream()
                .map(h -> new PurchaseHistoryResponse(h.getTipoItem().name(), h.getNomeItem(), h.getPrecoPago(), h.getCompradoEm()))
                .toList();
    }

    @Transactional
    public CompraResultado comprar(Usuario usuario, ComprarItemRequest request) {
        if (userInventoryRepository.existsByUsuarioIdAndTipoItemAndItemRefId(usuario.getId(), request.tipoItem(), request.itemRefId())) {
            throw new IllegalStateException("Você já possui este item.");
        }

        long preco;
        String nome;

        if (request.tipoItem() == TipoItemLoja.COSMETICO) {
            CosmeticItem item = cosmeticItemRepository.findById(request.itemRefId())
                    .orElseThrow(() -> new RecursoNaoEncontradoException("Cosmético não encontrado."));
            preco = item.getPreco();
            nome = item.getNome();
        } else {
            BackgroundTheme tema = backgroundThemeRepository.findById(request.itemRefId())
                    .orElseThrow(() -> new RecursoNaoEncontradoException("Cenário não encontrado."));
            preco = tema.getPreco();
            nome = tema.getNome();
        }

        gamificationService.debitarMoedas(usuario, preco);

        UserInventory novoItem = UserInventory.builder()
                .usuario(usuario)
                .tipoItem(request.tipoItem())
                .itemRefId(request.itemRefId())
                .equipado(false)
                .build();
        userInventoryRepository.save(novoItem);

        purchaseHistoryRepository.save(PurchaseHistory.builder()
                .usuario(usuario)
                .tipoItem(request.tipoItem())
                .itemRefId(request.itemRefId())
                .nomeItem(nome)
                .precoPago(preco)
                .build());

        log.info("Usuário {} comprou o item '{}' ({}) por {} moedas", usuario.getId(), nome, request.tipoItem(), preco);

        long saldoRestante = gamificationService.saldoDeMoedas(usuario.getId());
        return new CompraResultado(true, nome, preco, saldoRestante);
    }

    /**
     * Equipa um item já possuído. Para COSMETICO, desequipa qualquer
     * outro item da MESMA categoria antes (ex.: só um chapéu por vez,
     * mas um chapéu e um laço podem estar equipados simultaneamente —
     * a unicidade é por categoria, não por tipoItem todo). Para
     * CENARIO, desequipa qualquer outro cenário (só um por vez).
     */
    @Transactional
    public void equipar(UUID usuarioId, TipoItemLoja tipoItem, UUID itemRefId) {
        UserInventory itemDesejado = userInventoryRepository
                .findByUsuarioIdAndTipoItemAndItemRefId(usuarioId, tipoItem, itemRefId)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Você não possui este item."));

        if (tipoItem == TipoItemLoja.CENARIO) {
            desequiparTodosDoTipo(usuarioId, TipoItemLoja.CENARIO);
        } else {
            CosmeticItem cosmetico = cosmeticItemRepository.findById(itemRefId)
                    .orElseThrow(() -> new RecursoNaoEncontradoException("Cosmético não encontrado."));
            desequiparMesmaCategoria(usuarioId, cosmetico.getCategoria());
        }

        itemDesejado.setEquipado(true);
        userInventoryRepository.save(itemDesejado);
    }

    @Transactional
    public void desequipar(UUID usuarioId, TipoItemLoja tipoItem, UUID itemRefId) {
        UserInventory item = userInventoryRepository
                .findByUsuarioIdAndTipoItemAndItemRefId(usuarioId, tipoItem, itemRefId)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Você não possui este item."));
        item.setEquipado(false);
        userInventoryRepository.save(item);
    }

    private void desequiparTodosDoTipo(UUID usuarioId, TipoItemLoja tipoItem) {
        List<UserInventory> itens = userInventoryRepository.findByUsuarioIdAndTipoItem(usuarioId, tipoItem);
        for (UserInventory item : itens) {
            if (item.isEquipado()) {
                item.setEquipado(false);
                userInventoryRepository.save(item);
            }
        }
    }

    private void desequiparMesmaCategoria(UUID usuarioId, com.memora.cosmetic.entity.CategoriaCosmetico categoria) {
        List<UserInventory> cosmeticos = userInventoryRepository.findByUsuarioIdAndTipoItem(usuarioId, TipoItemLoja.COSMETICO);
        for (UserInventory item : cosmeticos) {
            if (!item.isEquipado()) continue;
            CosmeticItem cosmetico = cosmeticItemRepository.findById(item.getItemRefId()).orElse(null);
            if (cosmetico != null && cosmetico.getCategoria() == categoria) {
                item.setEquipado(false);
                userInventoryRepository.save(item);
            }
        }
    }

    private String nomeDoItem(TipoItemLoja tipo, UUID itemRefId) {
        if (tipo == TipoItemLoja.COSMETICO) {
            return cosmeticItemRepository.findById(itemRefId).map(CosmeticItem::getNome).orElse("Item removido");
        }
        return backgroundThemeRepository.findById(itemRefId).map(BackgroundTheme::getNome).orElse("Item removido");
    }

    private String iconeDoItem(TipoItemLoja tipo, UUID itemRefId) {
        if (tipo == TipoItemLoja.COSMETICO) {
            return cosmeticItemRepository.findById(itemRefId).map(CosmeticItem::getIcone).orElse("❔");
        }
        return backgroundThemeRepository.findById(itemRefId).map(BackgroundTheme::getIcone).orElse("❔");
    }

    private String posicaoOverlayDoItem(TipoItemLoja tipo, UUID itemRefId) {
        if (tipo != TipoItemLoja.COSMETICO) {
            return null;
        }
        return cosmeticItemRepository.findById(itemRefId).map(CosmeticItem::getPosicaoOverlay).orElse("topo");
    }

    private String gradienteDoItem(TipoItemLoja tipo, UUID itemRefId) {
        if (tipo != TipoItemLoja.CENARIO) {
            return null;
        }
        return backgroundThemeRepository.findById(itemRefId).map(BackgroundTheme::getGradiente).orElse(null);
    }

    /**
     * Código da cena viva associada a este cenário, se houver (ver
     * `BackgroundTheme.codigoCena`). É `null` para cosméticos e para
     * cenários que ainda não têm uma cena viva implementada — o
     * frontend trata esse `null` como sinal para usar o fallback de
     * gradiente.
     */
    private String codigoCenaDoItem(TipoItemLoja tipo, UUID itemRefId) {
        if (tipo != TipoItemLoja.CENARIO) {
            return null;
        }
        return backgroundThemeRepository.findById(itemRefId).map(BackgroundTheme::getCodigoCena).orElse(null);
    }
}
