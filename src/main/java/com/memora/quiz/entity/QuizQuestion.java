package com.memora.quiz.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.BatchSize;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Entity
@Table(name = "quiz_questions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuizQuestion {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @JdbcTypeCode(SqlTypes.CHAR)
    @Column(columnDefinition = "CHAR(36)")
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "quiz_id", nullable = false)
    private Quiz quiz;

    @Lob
    @Column(nullable = false, columnDefinition = "TEXT")
    private String pergunta;

    @Column(name = "ordem", nullable = false)
    @Builder.Default
    private int ordem = 0;

    @OneToMany(mappedBy = "quizQuestion", cascade = CascadeType.ALL, orphanRemoval = true)
    @BatchSize(size = 50)
    @Builder.Default
    private List<QuizAnswer> alternativas = new ArrayList<>();

    public void adicionarAlternativa(QuizAnswer alternativa) {
        alternativas.add(alternativa);
        alternativa.setQuizQuestion(this);
    }
}
