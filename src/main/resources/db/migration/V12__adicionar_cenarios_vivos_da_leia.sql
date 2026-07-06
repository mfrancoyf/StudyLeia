-- ============================================================================
-- V12: sistema de CENÁRIOS VIVOS da Leia
-- ----------------------------------------------------------------------------
-- Até aqui, `background_themes.gradiente` era a ÚNICA coisa que um cenário
-- definia visualmente (um valor CSS aplicado como cor/gradiente de fundo).
--
-- Esta migration adiciona `codigo_cena`: um identificador estável que liga
-- um tema do catálogo a uma implementação de cena viva no frontend
-- (elementos SVG próprios, animações contínuas e pequenas interações —
-- ver `static/js/scenes/*.js` e `static/css/leia-scenes.css`).
--
-- A coluna é NULA de propósito. Temas sem `codigo_cena` continuam
-- funcionando exatamente como antes (fallback para `gradiente` no
-- frontend) — nenhum cenário existente quebra com esta mudança.
-- ============================================================================

ALTER TABLE background_themes
    ADD COLUMN codigo_cena VARCHAR(40) NULL AFTER gradiente;

-- Liga os 3 temas existentes que já ganharam uma cena viva completa.
UPDATE background_themes SET codigo_cena = 'quarto'          WHERE nome = 'Quarto de Estudos';
UPDATE background_themes SET codigo_cena = 'noite-estrelada' WHERE nome = 'Céu Estrelado';
UPDATE background_themes SET codigo_cena = 'floresta'        WHERE nome = 'Jardim Florido';

-- Biblioteca, Universidade e Café Aconchegante permanecem com
-- codigo_cena NULL por ora — continuam usando o gradiente CSS de sempre,
-- até ganharem sua própria cena viva em uma versão futura.

-- Dois cenários novos, com cena viva completa desde o lançamento.
INSERT INTO background_themes (id, nome, descricao, raridade, preco, icone, gradiente, codigo_cena, ativo) VALUES
(UUID(), 'Praia Tranquila', 'Ondas, sol e o som do mar para estudar em paz.', 'RARA', 240, '🏖️', 'linear-gradient(135deg, #BFE7F5 0%, #4FB3D9 100%)', 'praia', TRUE),
(UUID(), 'Luzes da Cidade', 'O skyline noturno pulsando enquanto você estuda.', 'EPICA', 360, '🌆', 'linear-gradient(135deg, #1B1F3B 0%, #33395C 100%)', 'cidade', TRUE);
