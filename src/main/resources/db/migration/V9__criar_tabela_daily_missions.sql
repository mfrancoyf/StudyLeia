-- V9: Missões diárias
CREATE TABLE daily_missions (
    id CHAR(36) NOT NULL PRIMARY KEY,
    usuario_id CHAR(36) NOT NULL,
    data DATE NOT NULL,
    tipo VARCHAR(30) NOT NULL,
    progresso INT NOT NULL DEFAULT 0,
    meta INT NOT NULL,
    concluida BOOLEAN NOT NULL DEFAULT FALSE,

    CONSTRAINT fk_daily_missions_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    CONSTRAINT uq_daily_missions_usuario_data_tipo UNIQUE (usuario_id, data, tipo),
    INDEX idx_daily_missions_usuario_data (usuario_id, data)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
