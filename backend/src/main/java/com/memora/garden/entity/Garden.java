package com.memora.garden.entity;

import com.memora.auth.entity.Usuario;
import com.memora.common.entity.BaseEntity;
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
 * Representa o jardim de um usuário — principalmente o saldo de
 * sementes acumuladas (ganhas estudando) disponíveis para plantio.
 * As plantas em si são entidades separadas (UserPlant), relacionadas
 * 1:N a este jardim.
 */
@Entity
@Table(name = "gardens")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Garden extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @JdbcTypeCode(SqlTypes.CHAR)
    @Column(columnDefinition = "CHAR(36)")
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false, unique = true)
    private Usuario usuario;

    @Column(nullable = false)
    @Builder.Default
    private long sementes = 10; // saldo inicial para a usuária já poder plantar algo no primeiro acesso

    @Column(name = "total_flores_colhidas", nullable = false)
    @Builder.Default
    private long totalFloresColhidas = 0;
}
