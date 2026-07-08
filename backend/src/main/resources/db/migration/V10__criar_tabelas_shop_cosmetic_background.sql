-- V10: Catálogos de cosméticos e cenários + módulo de loja (inventário e histórico)
CREATE TABLE cosmetic_items (
    id CHAR(36) NOT NULL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao VARCHAR(255),
    categoria VARCHAR(30) NOT NULL,
    raridade VARCHAR(20) NOT NULL,
    preco BIGINT NOT NULL,
    icone VARCHAR(10) NOT NULL,
    posicao_overlay VARCHAR(20),
    ativo BOOLEAN NOT NULL DEFAULT TRUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE background_themes (
    id CHAR(36) NOT NULL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao VARCHAR(255),
    raridade VARCHAR(20) NOT NULL,
    preco BIGINT NOT NULL,
    icone VARCHAR(10) NOT NULL,
    gradiente VARCHAR(200) NOT NULL,
    ativo BOOLEAN NOT NULL DEFAULT TRUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE user_inventory (
    id CHAR(36) NOT NULL PRIMARY KEY,
    usuario_id CHAR(36) NOT NULL,
    tipo_item VARCHAR(20) NOT NULL,
    item_ref_id CHAR(36) NOT NULL,
    equipado BOOLEAN NOT NULL DEFAULT FALSE,
    adquirido_em DATETIME NOT NULL,

    CONSTRAINT fk_user_inventory_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    CONSTRAINT uq_user_inventory_item UNIQUE (usuario_id, tipo_item, item_ref_id),
    INDEX idx_user_inventory_usuario (usuario_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE purchase_history (
    id CHAR(36) NOT NULL PRIMARY KEY,
    usuario_id CHAR(36) NOT NULL,
    tipo_item VARCHAR(20) NOT NULL,
    item_ref_id CHAR(36) NOT NULL,
    nome_item VARCHAR(100) NOT NULL,
    preco_pago BIGINT NOT NULL,
    comprado_em DATETIME NOT NULL,

    CONSTRAINT fk_purchase_history_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    INDEX idx_purchase_history_usuario (usuario_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===================== SEED: catálogo inicial de cosméticos =====================
INSERT INTO cosmetic_items (id, nome, descricao, categoria, raridade, preco, icone, posicao_overlay, ativo) VALUES
(UUID(), 'Laço Azul Clássico', 'Um laço azul fofo, a cor favorita da Leia.', 'LACO', 'COMUM', 50, '🎀', 'topo', TRUE),
(UUID(), 'Laço Dourado', 'Um laço dourado brilhante para ocasiões especiais.', 'LACO', 'RARA', 150, '🎗️', 'topo', TRUE),
(UUID(), 'Óculos de Estudante', 'Óculos redondos para quem ama estudar.', 'OCULOS', 'COMUM', 60, '🤓', 'olhos', TRUE),
(UUID(), 'Óculos de Sol', 'Para os dias mais estilosos.', 'OCULOS', 'RARA', 140, '🕶️', 'olhos', TRUE),
(UUID(), 'Chapéu de Formatura', 'Para celebrar cada conquista acadêmica.', 'CHAPEU', 'EPICA', 300, '🎓', 'topo', TRUE),
(UUID(), 'Chapéu de Bruxinha', 'Um chapéu divertido e místico.', 'CHAPEU', 'RARA', 180, '🧙', 'topo', TRUE),
(UUID(), 'Gravata Borboleta', 'Elegância básica para a gatinha mais estudiosa.', 'GRAVATA', 'COMUM', 70, '🎩', 'pescoco', TRUE),
(UUID(), 'Coleira de Pérolas', 'Um acessório delicado e brilhante.', 'GRAVATA', 'RARA', 160, '📿', 'pescoco', TRUE),
(UUID(), 'Coroa Real', 'O acessório mais cobiçado — para quem já é Rainha Leia.', 'ACESSORIO_ESPECIAL', 'LEGENDARIA', 800, '👑', 'topo', TRUE),
(UUID(), 'Asas de Anjo', 'Acessório especial e raro, brilha suavemente.', 'ACESSORIO_ESPECIAL', 'LEGENDARIA', 750, '👼', 'costas', TRUE);

-- ===================== SEED: catálogo inicial de cenários =====================
INSERT INTO background_themes (id, nome, descricao, raridade, preco, icone, gradiente, ativo) VALUES
(UUID(), 'Quarto de Estudos', 'O cantinho cozy onde tudo começou.', 'COMUM', 0, '🛏️', 'linear-gradient(135deg, #EFF3FE 0%, #DCE4FB 100%)', TRUE),
(UUID(), 'Biblioteca', 'Estantes intermináveis de livros e silêncio acolhedor.', 'COMUM', 100, '📚', 'linear-gradient(135deg, #E8DCC8 0%, #D9C7A3 100%)', TRUE),
(UUID(), 'Jardim Florido', 'Flores e borboletas para um estudo mais leve.', 'RARA', 220, '🌷', 'linear-gradient(135deg, #E4F8EF 0%, #C8EFD9 100%)', TRUE),
(UUID(), 'Céu Estrelado', 'Perfeito para sessões de estudo noturnas.', 'EPICA', 380, '🌌', 'linear-gradient(135deg, #1C2B4A 0%, #34487A 100%)', TRUE),
(UUID(), 'Universidade', 'O sonho de toda estudante: o campus dos seus objetivos.', 'RARA', 260, '🏛️', 'linear-gradient(135deg, #FBE8E4 0%, #F5D2C8 100%)', TRUE),
(UUID(), 'Café Aconchegante', 'O cheirinho de café e o som de páginas virando.', 'EPICA', 340, '☕', 'linear-gradient(135deg, #F0E0C8 0%, #D9B98A 100%)', TRUE);
