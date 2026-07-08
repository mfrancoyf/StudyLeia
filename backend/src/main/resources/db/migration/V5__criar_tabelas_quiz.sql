-- V5: Quizzes, questões, alternativas e tentativas de resposta
CREATE TABLE quizzes (
    id CHAR(36) NOT NULL PRIMARY KEY,
    usuario_id CHAR(36) NOT NULL,
    titulo VARCHAR(150) NOT NULL,
    tema VARCHAR(100),
    dificuldade VARCHAR(20) NOT NULL,
    origem VARCHAR(10) NOT NULL,
    criado_em DATETIME NOT NULL,
    atualizado_em DATETIME NOT NULL,

    CONSTRAINT fk_quizzes_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    INDEX idx_quizzes_usuario (usuario_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE quiz_questions (
    id CHAR(36) NOT NULL PRIMARY KEY,
    quiz_id CHAR(36) NOT NULL,
    pergunta TEXT NOT NULL,
    ordem INT NOT NULL DEFAULT 0,

    CONSTRAINT fk_quiz_questions_quiz FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE,
    INDEX idx_quiz_questions_quiz (quiz_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE quiz_answers (
    id CHAR(36) NOT NULL PRIMARY KEY,
    quiz_question_id CHAR(36) NOT NULL,
    texto VARCHAR(500) NOT NULL,
    letra VARCHAR(1) NOT NULL,
    correta BOOLEAN NOT NULL DEFAULT FALSE,

    CONSTRAINT fk_quiz_answers_question FOREIGN KEY (quiz_question_id) REFERENCES quiz_questions(id) ON DELETE CASCADE,
    INDEX idx_quiz_answers_question (quiz_question_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE quiz_attempts (
    id CHAR(36) NOT NULL PRIMARY KEY,
    usuario_id CHAR(36) NOT NULL,
    quiz_question_id CHAR(36) NOT NULL,
    quiz_answer_escolhida_id CHAR(36) NOT NULL,
    correta BOOLEAN NOT NULL,
    respondida_em DATETIME NOT NULL,

    CONSTRAINT fk_quiz_attempts_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    CONSTRAINT fk_quiz_attempts_question FOREIGN KEY (quiz_question_id) REFERENCES quiz_questions(id) ON DELETE CASCADE,
    CONSTRAINT fk_quiz_attempts_answer FOREIGN KEY (quiz_answer_escolhida_id) REFERENCES quiz_answers(id) ON DELETE CASCADE,
    INDEX idx_quiz_attempts_usuario (usuario_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
