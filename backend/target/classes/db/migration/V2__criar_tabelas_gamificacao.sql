-- V2: Tabelas de gamificação — progresso (XP/nível/moedas), streak e conquistas
CREATE TABLE user_progress (
    id CHAR(36) NOT NULL PRIMARY KEY,
    usuario_id CHAR(36) NOT NULL UNIQUE,
    xp_total BIGINT NOT NULL DEFAULT 0,
    nivel_atual INT NOT NULL DEFAULT 1,
    moedas BIGINT NOT NULL DEFAULT 0,
    total_quizzes_respondidos BIGINT NOT NULL DEFAULT 0,
    total_questoes_corretas BIGINT NOT NULL DEFAULT 0,
    total_anotacoes_criadas BIGINT NOT NULL DEFAULT 0,
    total_planos_concluidos BIGINT NOT NULL DEFAULT 0,
    total_minutos_foco BIGINT NOT NULL DEFAULT 0,
    criado_em DATETIME NOT NULL,
    atualizado_em DATETIME NOT NULL,

    CONSTRAINT fk_user_progress_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE streaks (
    id CHAR(36) NOT NULL PRIMARY KEY,
    usuario_id CHAR(36) NOT NULL UNIQUE,
    sequencia_atual INT NOT NULL DEFAULT 0,
    maior_sequencia INT NOT NULL DEFAULT 0,
    ultimo_dia_estudado DATE,
    criado_em DATETIME NOT NULL,
    atualizado_em DATETIME NOT NULL,

    CONSTRAINT fk_streaks_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE achievements (
    id CHAR(36) NOT NULL PRIMARY KEY,
    usuario_id CHAR(36) NOT NULL,
    tipo VARCHAR(40) NOT NULL,
    desbloqueada_em DATETIME NOT NULL,

    CONSTRAINT fk_achievements_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    CONSTRAINT uq_achievements_usuario_tipo UNIQUE (usuario_id, tipo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
