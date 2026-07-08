-- ============================================================================
-- V13: liga os 3 temas que ainda usavam gradiente sólido às suas novas
-- cenas vivas (biblioteca, universidade, cafe — ver static/js/scenes/*.js).
--
-- A V12 tinha deixado esses 3 propositalmente com codigo_cena NULL, "até
-- ganharem sua própria cena viva em uma versão futura" — essa versão é
-- esta migration.
-- ============================================================================

UPDATE background_themes SET codigo_cena = 'biblioteca'   WHERE nome = 'Biblioteca';
UPDATE background_themes SET codigo_cena = 'universidade' WHERE nome = 'Universidade';
UPDATE background_themes SET codigo_cena = 'cafe'         WHERE nome = 'Café Aconchegante';
