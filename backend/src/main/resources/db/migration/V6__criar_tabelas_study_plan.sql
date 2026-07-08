-- V6: Planos de estudo gerados (via IA) e seus itens de cronograma
CREATE TABLE study_plans (
    id CHAR(36) NOT NULL PRIMARY KEY,
    usuario_id CHAR(36) NOT NULL,
    materia VARCHAR(150) NOT NULL,
    data_prova DATE NOT NULL,
    horas_disponiveis_por_dia DOUBLE NOT NULL,
    resumo TEXT,
    concluido BOOLEAN NOT NULL DEFAULT FALSE,
    criado_em DATETIME NOT NULL,
    atualizado_em DATETIME NOT NULL,

    CONSTRAINT fk_study_plans_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    INDEX idx_study_plans_usuario (usuario_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE study_plan_items (
    id CHAR(36) NOT NULL PRIMARY KEY,
    study_plan_id CHAR(36) NOT NULL,
    data DATE NOT NULL,
    assunto VARCHAR(200) NOT NULL,
    tipo VARCHAR(20) NOT NULL,
    descricao TEXT,
    concluido BOOLEAN NOT NULL DEFAULT FALSE,

    CONSTRAINT fk_study_plan_items_plan FOREIGN KEY (study_plan_id) REFERENCES study_plans(id) ON DELETE CASCADE,
    INDEX idx_study_plan_items_plan (study_plan_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
