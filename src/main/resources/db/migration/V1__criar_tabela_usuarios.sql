-- V1: Tabela de usuários (autenticação e perfil)
CREATE TABLE usuarios (
    id CHAR(36) NOT NULL PRIMARY KEY,
    email VARCHAR(150) NOT NULL UNIQUE,
    nome VARCHAR(100) NOT NULL,
    nome_da_pet VARCHAR(60) DEFAULT 'Leia',
    senha_hash VARCHAR(255) NOT NULL,
    cor_tema VARCHAR(20) DEFAULT 'azul',
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    token_recuperacao VARCHAR(255),
    token_recuperacao_expira_em DATETIME,
    criado_em DATETIME NOT NULL,
    atualizado_em DATETIME NOT NULL,

    INDEX idx_usuarios_email (email),
    INDEX idx_usuarios_token_recuperacao (token_recuperacao)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
