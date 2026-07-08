package com.memora.shop.entity;

/**
 * Discrimina a que catálogo um item da loja pertence. O Shop não
 * duplica os dados do item (nome, preço, raridade) — ele apenas
 * referencia o id do item no catálogo correspondente
 * (CosmeticItem ou BackgroundTheme) via `itemRefId`.
 */
public enum TipoItemLoja {
    COSMETICO,
    CENARIO
}
