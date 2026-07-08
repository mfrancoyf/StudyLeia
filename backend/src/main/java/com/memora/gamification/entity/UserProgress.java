package com.memora.gamification.entity;

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
 * Progresso de gamificação de um usuário: XP total acumulado, nível
 * atual e saldo de moedas. É o "placar" central que o Dashboard e o
 * PetService consultam para decidir o estágio de evolução da Leia.
 */
@Entity
@Table(name = "user_progress")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserProgress extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @JdbcTypeCode(SqlTypes.CHAR)
    @Column(columnDefinition = "CHAR(36)")
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false, unique = true)
    private Usuario usuario;

    @Column(name = "xp_total", nullable = false)
    @Builder.Default
    private long xpTotal = 0;

    @Column(name = "nivel_atual", nullable = false)
    @Builder.Default
    private int nivelAtual = 1;

    @Column(name = "moedas", nullable = false)
    @Builder.Default
    private long moedas = 0;

    @Column(name = "total_quizzes_respondidos", nullable = false)
    @Builder.Default
    private long totalQuizzesRespondidos = 0;

    @Column(name = "total_questoes_corretas", nullable = false)
    @Builder.Default
    private long totalQuestoesCorretas = 0;

    @Column(name = "total_anotacoes_criadas", nullable = false)
    @Builder.Default
    private long totalAnotacoesCriadas = 0;

    @Column(name = "total_planos_concluidos", nullable = false)
    @Builder.Default
    private long totalPlanosConcluidos = 0;

    @Column(name = "total_minutos_foco", nullable = false)
    @Builder.Default
    private long totalMinutosFoco = 0;
}
