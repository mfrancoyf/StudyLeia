package com.memora.shop.dto;

import com.memora.shop.entity.TipoItemLoja;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record ComprarItemRequest(

        @NotNull(message = "Informe o tipo do item (COSMETICO ou CENARIO)")
        TipoItemLoja tipoItem,

        @NotNull(message = "Informe o id do item")
        UUID itemRefId
) {
}
