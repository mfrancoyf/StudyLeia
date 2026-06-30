package com.memora.gamification.entity;

import com.memora.auth.entity.Usuario;
import com.memora.common.entity.BaseEntity;
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
 * Controla a sequência de dias consecutivos em que o usuário realizou
 * pelo menos uma atividade que conta para o streak (responder quiz,
 * completar pomodoro, concluir meta diária, etc).
 */
@Entity
@Table(name = "streaks")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Streak extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @JdbcTypeCode(SqlTypes.CHAR)
    @Column(columnDefinition = "CHAR(36)")
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false, unique = true)
    private Usuario usuario;

    @Column(name = "sequencia_atual", nullable = false)
    @Builder.Default
    private int sequenciaAtual = 0;

    @Column(name = "maior_sequencia", nullable = false)
    @Builder.Default
    private int maiorSequencia = 0;

    @Column(name = "ultimo_dia_estudado")
    private LocalDate ultimoDiaEstudado;
}
