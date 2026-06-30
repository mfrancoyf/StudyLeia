package com.memora.gamification.entity;

import com.memora.auth.entity.Usuario;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

/**
 * Registro de uma conquista/badge desbloqueada por um usuário. Cada
 * combinação (usuario, tipo) é única — a conquista só é registrada
 * uma vez, na primeira vez que a regra é satisfeita.
 */
@Entity
@Table(name = "achievements", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"usuario_id", "tipo"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Achievement {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @JdbcTypeCode(SqlTypes.CHAR)
    @Column(columnDefinition = "CHAR(36)")
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo", nullable = false, length = 40)
    private TipoConquista tipo;

    @Column(name = "desbloqueada_em", nullable = false)
    private LocalDateTime desbloqueadaEm;

    @PrePersist
    public void prePersist() {
        if (desbloqueadaEm == null) {
            desbloqueadaEm = LocalDateTime.now();
        }
    }
}
