-- V3: Estado da Leia (pet virtual) por usuário
CREATE TABLE pet_status (
    id CHAR(36) NOT NULL PRIMARY KEY,
    usuario_id CHAR(36) NOT NULL UNIQUE,
    nome_pet VARCHAR(60) DEFAULT 'Leia',
    humor VARCHAR(20) NOT NULL DEFAULT 'FELIZ',
    estagio_evolucao VARCHAR(20) NOT NULL DEFAULT 'FILHOTE',
    ultima_interacao_em DATETIME,
    total_carinhos INT NOT NULL DEFAULT 0,
    criado_em DATETIME NOT NULL,
    atualizado_em DATETIME NOT NULL,

    CONSTRAINT fk_pet_status_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
