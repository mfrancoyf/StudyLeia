package com.memora.quiz.repository;

import com.memora.quiz.entity.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface QuizRepository extends JpaRepository<Quiz, UUID> {

    List<Quiz> findByUsuarioIdOrderByCriadoEmDesc(UUID usuarioId);

    @Query("select q from Quiz q left join fetch q.questoes qs left join fetch qs.alternativas where q.id = :id")
    Optional<Quiz> buscarComQuestoesEAlternativas(UUID id);

    long countByUsuarioId(UUID usuarioId);
}
