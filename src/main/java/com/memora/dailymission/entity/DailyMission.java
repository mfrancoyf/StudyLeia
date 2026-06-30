package com.memora.dailymission.entity;

import com.memora.auth.entity.Usuario;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.UUID;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

/**
 * Uma missão diária concreta de um usuário, para uma data específica.
 * É gerado um conjunto fixo de missões (ver DailyMissionService) toda
 * vez que a usuária acessa a plataforma num dia novo.
 */
@Entity
@Table(name = "daily_missions", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"usuario_id", "data", "tipo"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DailyMission {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @JdbcTypeCode(SqlTypes.CHAR)
    @Column(columnDefinition = "CHAR(36)")
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @Column(nullable = false)
    private LocalDate data;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private TipoMissaoDiaria tipo;

    @Column(nullable = false)
    @Builder.Default
    private int progresso = 0;

    @Column(nullable = false)
    private int meta;

    @Column(nullable = false)
    @Builder.Default
    private boolean concluida = false;
}
