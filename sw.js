/* Offline cache for Cub Quest.
   Bump CACHE when the site changes, so iPads pick up the new version. */
const CACHE = "cub-quest-v21";
const CORE = [
  "./",
  "index.html",
  "badger-game.js",
  "badger-ui.js",
  "manifest.webmanifest",
  "louis.webp",
  "icon-180.png",
  "icon-192.png",
  "icon-512.png",
  "fonts/grandstander.woff2",
  "fonts/nunito.woff2"
];

/* Existing audio is cached lazily on first use. */
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

function withBadgerDash(html) {
  if (html.includes('badger-ui.js')) return html;
  const scripts = `<script src="badger-game.js"></script>\n<script src="badger-ui.js"></script>`;
  return html.replace("</body>", scripts + "\n</body>");
}

async function serveHtml(request) {
  const cached = await caches.match(request, { ignoreSearch: true }) || await caches.match("index.html");
  let response = cached;
  try {
    const fresh = await fetch(request);
    if (fresh && fresh.ok) {
      response = fresh;
      const copy = fresh.clone();
      caches.open(CACHE).then((c) => c.put(request, copy));
    }
  } catch (_) {}
  if (!response) return fetch(request);
  const html = await response.text();
  return new Response(withBadgerDash(html), {
    status: response.status,
    statusText: response.statusText,
    headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-cache" }
  });
}

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;

  const url = new URL(e.request.url);
  const isNavigation = e.request.mode === "navigate" || url.pathname.endsWith("/cub-quest/") || url.pathname.endsWith("/cub-quest/index.html");
  if (isNavigation) {
    e.respondWith(serveHtml(e.request));
    return;
  }

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
