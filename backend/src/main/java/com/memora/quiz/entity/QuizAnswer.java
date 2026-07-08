package com.memora.quiz.entity;

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
 * Cada linha é uma alternativa (A, B, C ou D) de uma QuizQuestion.
 * Apenas uma alternativa por questão deve ter correta=true — essa
 * regra é garantida na camada de Service, não no banco.
 */
@Entity
@Table(name = "quiz_answers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuizAnswer {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @JdbcTypeCode(SqlTypes.CHAR)
    @Column(columnDefinition = "CHAR(36)")
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "quiz_question_id", nullable = false)
    private QuizQuestion quizQuestion;

    @Column(nullable = false, length = 500)
    private String texto;

    @Column(name = "letra", nullable = false, length = 1)
    private String letra; // "A", "B", "C" ou "D"

    @Column(name = "correta", nullable = false)
    @Builder.Default
    private boolean correta = false;
}
