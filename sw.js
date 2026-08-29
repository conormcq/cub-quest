/* Offline cache for Cub Quest.
   Bump CACHE when the site changes, so iPads pick up the new version. */
const CACHE = "cub-quest-v19";
const CORE = [
  "./",
  "index.html",
  "badger-game.js",
  "manifest.webmanifest",
  "louis.webp",
  "icon-180.png",
  "icon-192.png",
  "icon-512.png",
  "fonts/grandstander.woff2",
  "fonts/nunito.woff2"
];

/* Existing audio is cached lazily on first use. This keeps installation robust
   while still making the new game and app shell immediately available offline. */
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE)
      .then((c) => c.addAll(CORE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then((hit) => {
      if (hit) return hit;
      return fetch(e.request).then((res) => {
        if (res && res.ok && res.type === "basic") {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(e.request, copy));
        }
        return res;
      }).catch(() => caches.match("index.html"));
    })
  );
});
