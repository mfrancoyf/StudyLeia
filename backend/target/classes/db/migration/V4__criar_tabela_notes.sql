-- V4: Anotações de estudo
CREATE TABLE notes (
    id CHAR(36) NOT NULL PRIMARY KEY,
    usuario_id CHAR(36) NOT NULL,
    titulo VARCHAR(200) NOT NULL,
    conteudo LONGTEXT NOT NULL,
    categoria VARCHAR(80),
    tags VARCHAR(300),
    criado_em DATETIME NOT NULL,
    atualizado_em DATETIME NOT NULL,

    CONSTRAINT fk_notes_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    INDEX idx_notes_usuario (usuario_id),
    INDEX idx_notes_categoria (categoria)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
