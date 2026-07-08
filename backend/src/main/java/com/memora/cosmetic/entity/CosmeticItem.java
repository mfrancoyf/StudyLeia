package com.memora.cosmetic.entity;

import com.memora.shop.entity.Raridade;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

/**
 * Catálogo de cosméticos que a Leia pode usar (laços, óculos,
 * chapéus, gravatas, acessórios especiais). É conteúdo estático do
 * sistema (não pertence a nenhum usuário) — o que pertence ao
 * usuário é o registro de posse, no UserInventory (módulo shop).
 *
 * O campo `icone` guarda um emoji/glifo simples (sem dependência de
 * arquivos de imagem externos, por decisão de produto) usado tanto no
 * catálogo da loja quanto sobreposto ao SVG da Leia quando equipado.
 */
@Entity
@Table(name = "cosmetic_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CosmeticItem {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @JdbcTypeCode(SqlTypes.CHAR)
    @Column(columnDefinition = "CHAR(36)")
    private UUID id;

    @Column(nullable = false, length = 100)
    private String nome;

    @Column(length = 255)
    private String descricao;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private CategoriaCosmetico categoria;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Raridade raridade;

    @Column(nullable = false)
    private long preco;

    /**
     * Emoji ou glifo simples representando o item visualmente
     * (ex.: "🎀" para um laço). Usado no catálogo e no overlay sobre
     * o SVG da Leia.
     */
    @Column(nullable = false, length = 10)
    private String icone;

    /**
     * Posição relativa de sobreposição no SVG da Leia (ex.: "topo",
     * "pescoco", "olhos") — usada pelo frontend para posicionar o
     * `icone` corretamente em cima do mascote quando equipado.
     */
    @Column(name = "posicao_overlay", length = 20)
    private String posicaoOverlay;

    @Column(nullable = false)
    @Builder.Default
    private boolean ativo = true;
}
