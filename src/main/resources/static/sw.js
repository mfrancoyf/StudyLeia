/**
 * Service Worker do Memora — Leia Edition.
 *
 * Estratégia:
 *  - Assets estáticos (CSS/JS/manifest/ícones): cache-first, com
 *    fallback para a rede se não estiver em cache. Isso faz o app
 *    abrir quase instantaneamente em visitas repetidas, mesmo com
 *    conexão lenta.
 *  - Chamadas de API (/api/**) e navegação de página: network-only —
 *    nunca servimos dados do usuário a partir de um cache antigo,
 *    para não mostrar XP/notas/quizzes desatualizados.
 */

const CACHE_NAME = 'memora-cache-v1';

const ASSETS_ESTATICOS = [
  '/css/memora.css',
  '/css/leia.css',
  '/js/memora.js',
  '/manifest.json',
];

self.addEventListener('install', (evento) => {
  evento.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_ESTATICOS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (evento) => {
  evento.waitUntil(
    caches.keys().then((nomes) =>
      Promise.all(nomes.filter((nome) => nome !== CACHE_NAME).map((nome) => caches.delete(nome)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (evento) => {
  const url = new URL(evento.request.url);

  // Nunca cachear chamadas de API — dados do usuário sempre frescos.
  if (url.pathname.startsWith('/api/')) {
    return;
  }

  // Apenas assets estáticos conhecidos usam cache-first.
  const ehAssetEstatico = ASSETS_ESTATICOS.some((asset) => url.pathname === asset)
    || url.pathname.startsWith('/img/icons/');

  if (!ehAssetEstatico) {
    return;
  }

  evento.respondWith(
    caches.match(evento.request).then((respostaCache) => {
      if (respostaCache) {
        return respostaCache;
      }
      return fetch(evento.request).then((respostaRede) => {
        const clone = respostaRede.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(evento.request, clone));
        return respostaRede;
      });
    })
  );
});
