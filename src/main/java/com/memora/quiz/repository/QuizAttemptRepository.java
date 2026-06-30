package com.memora.quiz.repository;

import com.memora.quiz.entity.QuizAttempt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface QuizAttemptRepository extends JpaRepository<QuizAttempt, UUID> {

    Optional<QuizAttempt> findByUsuarioIdAndQuizQuestionId(UUID usuarioId, UUID quizQuestionId);

    long countByUsuarioIdAndCorretaTrue(UUID usuarioId);

    long countByUsuarioId(UUID usuarioId);

    List<QuizAttempt> findByUsuarioIdAndRespondidaEmBetween(UUID usuarioId, LocalDateTime inicio, LocalDateTime fim);

    /**
     * Agrega o total de tentativas e acertos por tema do quiz ao qual
     * a questão pertence — usado para os gráficos de "matérias mais/
     * menos estudadas" e "acertos por matéria" das estatísticas.
     */
    @Query("""
            select coalesce(q.tema, 'Geral') as tema,
                   count(a) as total,
                   sum(case when a.correta = true then 1 else 0 end) as corretas
            from QuizAttempt a
                 join a.quizQuestion qq
                 join qq.quiz q
            where a.usuario.id = :usuarioId
            group by coalesce(q.tema, 'Geral')
            """)
    List<Object[]> agregarPorTema(@Param("usuarioId") UUID usuarioId);
}
