-- V7: Calendário de provas, trabalhos, apresentações e lembretes
CREATE TABLE events (
    id CHAR(36) NOT NULL PRIMARY KEY,
    usuario_id CHAR(36) NOT NULL,
    titulo VARCHAR(150) NOT NULL,
    tipo VARCHAR(20) NOT NULL,
    data_hora DATETIME NOT NULL,
    descricao TEXT,
    alerta_enviado BOOLEAN NOT NULL DEFAULT FALSE,
    criado_em DATETIME NOT NULL,
    atualizado_em DATETIME NOT NULL,

    CONSTRAINT fk_events_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    INDEX idx_events_usuario (usuario_id),
    INDEX idx_events_data_hora (data_hora)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
