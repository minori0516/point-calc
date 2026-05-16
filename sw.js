const CACHE_NAME = 'rakuten-marathon-v3';
const ASSETS = [
  '/point-calc/',
  '/point-calc/index.html',
  '/point-calc/privacy.html',
  '/point-calc/manifest.json',
  '/point-calc/icon-192.png',
  '/point-calc/icon-512.png'
];

// インストール時にキャッシュ
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// 古いキャッシュを削除
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// キャッシュ優先・ネットワークフォールバック
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      return cached || fetch(event.request);
    })
  );
});
