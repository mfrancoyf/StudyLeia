/**
 * Registra o service worker do PWA. Executa silenciosamente — se o
 * navegador não suportar (ex.: contexto não-HTTPS em produção), a
 * aplicação continua funcionando normalmente como site comum.
 */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // Falha silenciosa: PWA é um "extra", não deve quebrar o app.
    });
  });
}
