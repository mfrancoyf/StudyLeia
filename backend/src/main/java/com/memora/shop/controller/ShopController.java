package com.memora.shop.controller;

import com.memora.config.security.UsuarioAutenticado;
import com.memora.shop.dto.*;
import com.memora.shop.entity.TipoItemLoja;
import com.memora.shop.service.ShopService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/shop")
@RequiredArgsConstructor
@Tag(name = "Loja", description = "Catálogo combinado de cosméticos e cenários, compras, inventário e equipagem")
public class ShopController {

    private final ShopService shopService;

    @GetMapping("/catalogo")
    @Operation(summary = "Lista o catálogo completo da loja (cosméticos + cenários), com posse e equipagem do usuário")
    public ResponseEntity<List<ItemLojaResponse>> catalogo() {
        var usuario = UsuarioAutenticado.obter();
        return ResponseEntity.ok(shopService.listarCatalogo(usuario.getId()));
    }

    @GetMapping("/inventory")
    @Operation(summary = "Lista os itens que o usuário já possui")
    public ResponseEntity<List<InventoryItemResponse>> inventario() {
        var usuario = UsuarioAutenticado.obter();
        return ResponseEntity.ok(shopService.listarInventario(usuario.getId()));
    }

    @GetMapping("/history")
    @Operation(summary = "Lista o histórico de compras do usuário")
    public ResponseEntity<List<PurchaseHistoryResponse>> historico() {
        var usuario = UsuarioAutenticado.obter();
        return ResponseEntity.ok(shopService.listarHistorico(usuario.getId()));
    }

    @PostMapping("/comprar")
    @Operation(summary = "Compra um item da loja, debitando moedas do saldo do usuário")
    public ResponseEntity<CompraResultado> comprar(@Valid @RequestBody ComprarItemRequest request) {
        var usuario = UsuarioAutenticado.obter();
        return ResponseEntity.ok(shopService.comprar(usuario, request));
    }

    @PostMapping("/equipar")
    @Operation(summary = "Equipa um item já possuído (desequipa automaticamente o item anterior da mesma categoria)")
    public ResponseEntity<Void> equipar(@RequestParam TipoItemLoja tipoItem, @RequestParam UUID itemRefId) {
        var usuario = UsuarioAutenticado.obter();
        shopService.equipar(usuario.getId(), tipoItem, itemRefId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/desequipar")
    @Operation(summary = "Desequipa um item atualmente equipado")
    public ResponseEntity<Void> desequipar(@RequestParam TipoItemLoja tipoItem, @RequestParam UUID itemRefId) {
        var usuario = UsuarioAutenticado.obter();
        shopService.desequipar(usuario.getId(), tipoItem, itemRefId);
        return ResponseEntity.ok().build();
    }
}
