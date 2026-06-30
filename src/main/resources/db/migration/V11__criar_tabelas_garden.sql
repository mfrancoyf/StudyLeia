-- V11: Jardim da Leia — sementes e plantas
CREATE TABLE gardens (
    id CHAR(36) NOT NULL PRIMARY KEY,
    usuario_id CHAR(36) NOT NULL UNIQUE,
    sementes BIGINT NOT NULL DEFAULT 10,
    total_flores_colhidas BIGINT NOT NULL DEFAULT 0,
    criado_em DATETIME NOT NULL,
    atualizado_em DATETIME NOT NULL,

    CONSTRAINT fk_gardens_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE user_plants (
    id CHAR(36) NOT NULL PRIMARY KEY,
    garden_id CHAR(36) NOT NULL,
    posicao_vaso INT NOT NULL,
    tipo VARCHAR(20) NOT NULL,
    estagio VARCHAR(20) NOT NULL DEFAULT 'SEMENTE',
    plantada_em DATETIME NOT NULL,
    xp_no_plantio BIGINT NOT NULL,
    metas_concluidas_no_plantio BIGINT NOT NULL,
    colhida BOOLEAN NOT NULL DEFAULT FALSE,

    CONSTRAINT fk_user_plants_garden FOREIGN KEY (garden_id) REFERENCES gardens(id) ON DELETE CASCADE,
    INDEX idx_user_plants_garden (garden_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
