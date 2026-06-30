package com.memora.quiz.entity;

import com.memora.auth.entity.Usuario;
import com.memora.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Entity
@Table(name = "quizzes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Quiz extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @JdbcTypeCode(SqlTypes.CHAR)
    @Column(columnDefinition = "CHAR(36)")
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @Column(nullable = false, length = 150)
    private String titulo;

    @Column(length = 100)
    private String tema;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Dificuldade dificuldade;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private OrigemQuiz origem;

    @OneToMany(mappedBy = "quiz", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<QuizQuestion> questoes = new ArrayList<>();

    public void adicionarQuestao(QuizQuestion questao) {
        questoes.add(questao);
        questao.setQuiz(this);
    }
}
