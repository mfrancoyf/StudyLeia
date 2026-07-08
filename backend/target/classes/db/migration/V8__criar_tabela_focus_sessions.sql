-- V8: Sessões do Modo Foco (Pomodoro)
CREATE TABLE focus_sessions (
    id CHAR(36) NOT NULL PRIMARY KEY,
    usuario_id CHAR(36) NOT NULL,
    tipo VARCHAR(10) NOT NULL,
    duracao_minutos INT NOT NULL,
    concluida_em DATETIME NOT NULL,

    CONSTRAINT fk_focus_sessions_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    INDEX idx_focus_sessions_usuario (usuario_id),
    INDEX idx_focus_sessions_concluida_em (concluida_em)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
