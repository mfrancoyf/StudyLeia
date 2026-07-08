-- V14: Novos itens de cosmético — Boina de Artista, Cachecol Listrado,
-- Óculos Gatinho Retrô e Coroa de Flores. Nomes têm que bater exatamente
-- com as chaves em frontend/src/features/leia/accessories/accessoryConfig.tsx
-- (ver ACCESSORY_CONFIG) pra encaixar certinho na Leia.
INSERT INTO cosmetic_items (id, nome, descricao, categoria, raridade, preco, icone, posicao_overlay, ativo) VALUES
(UUID(), 'Boina de Artista', 'Pra quem estuda com estilo francês.', 'CHAPEU', 'COMUM', 90, '🎨', 'topo', TRUE),
(UUID(), 'Cachecol Listrado', 'Aconchegante pras sessões de estudo mais frias.', 'GRAVATA', 'COMUM', 80, '🧣', 'pescoco', TRUE),
(UUID(), 'Óculos Gatinho Retrô', 'Um toque vintage e cheio de personalidade.', 'OCULOS', 'EPICA', 260, '😺', 'olhos', TRUE),
(UUID(), 'Coroa de Flores', 'Delicada, primaveril e cheia de charme.', 'ACESSORIO_ESPECIAL', 'RARA', 200, '🌸', 'topo', TRUE);
