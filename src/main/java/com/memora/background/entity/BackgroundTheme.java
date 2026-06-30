package com.memora.background.entity;

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
 * Catálogo de cenários de fundo para a tela principal da Leia
 * (Biblioteca, Quarto de Estudos, Jardim, Céu Estrelado, Universidade,
 * Café...). Assim como CosmeticItem, é conteúdo estático do sistema.
 *
 * `gradiente` guarda um valor CSS (ex.: "linear-gradient(...)") usado
 * diretamente como `background` do container da Leia — sem depender
 * de nenhuma imagem externa, conforme decisão de produto.
 */
@Entity
@Table(name = "background_themes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BackgroundTheme {

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
    @Column(nullable = false, length = 20)
    private Raridade raridade;

    @Column(nullable = false)
    private long preco;

    @Column(nullable = false, length = 10)
    private String icone;

    @Column(nullable = false, length = 200)
    private String gradiente;

    @Column(nullable = false)
    @Builder.Default
    private boolean ativo = true;
}
