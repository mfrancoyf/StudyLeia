package com.memora.quiz.entity;

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
 * Registra a resposta que a usuária deu para uma questão específica.
 * Usado para: (1) impedir XP em duplicidade caso a mesma questão seja
 * respondida mais de uma vez na mesma "rodada", e (2) estatísticas
 * futuras (% de acerto por tema, histórico de desempenho).
 */
@Entity
@Table(name = "quiz_attempts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuizAttempt {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @JdbcTypeCode(SqlTypes.CHAR)
    @Column(columnDefinition = "CHAR(36)")
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "quiz_question_id", nullable = false)
    private QuizQuestion quizQuestion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "quiz_answer_escolhida_id", nullable = false)
    private QuizAnswer respostaEscolhida;

    @Column(name = "correta", nullable = false)
    private boolean correta;

    @Column(name = "respondida_em", nullable = false)
    private LocalDateTime respondidaEm;

    @PrePersist
    public void prePersist() {
        if (respondidaEm == null) {
            respondidaEm = LocalDateTime.now();
        }
    }
}
