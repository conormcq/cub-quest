/* Cub Quest offline/update strategy.
   - App shell is versioned and refreshed on each release.
   - Narration/audio is kept in a persistent runtime cache across releases.
   - Navigations are network-first, with the cached app as offline fallback. */
const SHELL_CACHE = "cub-quest-shell-v24";
const RUNTIME_CACHE = "cub-quest-runtime-v1";

const CORE = [
  "./",
  "index.html",
  "badger-game.js",
  "badger-ui.js",
  "games/game-shell.js",
  "games/woodland-games.js",
  "games/air-games.js",
  "games/water-games.js",
  "games/game-lab.js",
  "app-update.js",
  "manifest.webmanifest",
  "louis.webp",
  "icon-180.png",
  "icon-192.png",
  "icon-512.png",
  "fonts/grandstander.woff2",
  "fonts/nunito.woff2"
];

const RUNTIME_SCRIPTS = [
  "badger-game.js",
  "badger-ui.js",
  "games/game-shell.js",
  "games/woodland-games.js",
  "games/air-games.js",
  "games/water-games.js",
  "games/game-lab.js",
  "app-update.js"
];

const FRESH_FILES = new Set(RUNTIME_SCRIPTS.map((src) => src.split("/").pop()).concat(["manifest.webmanifest"]));

async function precacheFreshShell(){
  const cache = await caches.open(SHELL_CACHE);
  await Promise.all(CORE.map(async (path) => {
    const response = await fetch(path, { cache: "reload" });
    if (!response || !response.ok) throw new Error("Failed to precache " + path);
    await cache.put(path, response.clone());
  }));
}

self.addEventListener("install", (event) => {
  event.waitUntil(precacheFreshShell().then(() => self.skipWaiting()));
});

/* Preserve audio already downloaded by older Cub Quest workers before removing
   their caches. This is especially useful for an iPad used away from Wi-Fi. */
async function migrateOldAudioAndClean(){
  const keys = await caches.keys();
  const runtime = await caches.open(RUNTIME_CACHE);

  for (const key of keys) {
    if (key === SHELL_CACHE || key === RUNTIME_CACHE) continue;
    if (!key.startsWith("cub-quest-")) continue;

    const oldCache = await caches.open(key);
    const requests = await oldCache.keys();
    for (const request of requests) {
      const url = new URL(request.url);
      if (url.pathname.includes("/audio/")) {
        const response = await oldCache.match(request);
        if (response) await runtime.put(request, response);
      }
    }
    await caches.delete(key);
  }
}

self.addEventListener("activate", (event) => {
  event.waitUntil(migrateOldAudioAndClean().then(() => self.clients.claim()));
});

function withRuntimeScripts(html){
  const missing = RUNTIME_SCRIPTS.filter((src) => !html.includes('src="' + src + '"'));
  if (!missing.length) return html;
  const scripts = missing.map((src) => '<script src="' + src + '"></script>').join("\n");
  return html.replace("</body>", scripts + "\n</body>");
}

async function navigationResponse(request){
  let response = null;
  try {
    const fresh = await fetch(request, { cache: "no-store" });
    if (fresh && fresh.ok) {
      response = fresh;
      const shell = await caches.open(SHELL_CACHE);
      await shell.put("index.html", fresh.clone());
      await shell.put("./", fresh.clone());
    }
  } catch (_) {}

  if (!response) {
    response = await caches.match("index.html", { cacheName: SHELL_CACHE }) ||
               await caches.match("./", { cacheName: SHELL_CACHE });
  }

  if (!response) {
    return new Response("Cub Quest is offline and has not finished installing yet.", {
      status: 503,
      headers: { "Content-Type": "text/plain; charset=utf-8" }
    });
  }

  const html = await response.text();
  const headers = new Headers(response.headers);
  headers.set("Content-Type", "text/html; charset=utf-8");
  headers.set("Cache-Control", "no-store");
  headers.delete("Content-Length");
  return new Response(withRuntimeScripts(html), {
    status: response.status,
    statusText: response.statusText,
    headers
  });
}

async function networkFirst(request){
  try {
    const fresh = await fetch(request, { cache: "no-store" });
    if (fresh && fresh.ok) {
      const shell = await caches.open(SHELL_CACHE);
      await shell.put(request, fresh.clone());
      return fresh;
    }
  } catch (_) {}
  return (await caches.match(request, { cacheName: SHELL_CACHE, ignoreSearch: true })) ||
         (await caches.match(request, { cacheName: RUNTIME_CACHE, ignoreSearch: true })) ||
         new Response("", { status: 504 });
}

async function cacheFirstRuntime(request){
  const shellHit = await caches.match(request, { cacheName: SHELL_CACHE, ignoreSearch: true });
  if (shellHit) return shellHit;

  const runtimeHit = await caches.match(request, { cacheName: RUNTIME_CACHE, ignoreSearch: true });
  if (runtimeHit) return runtimeHit;

  try {
    const response = await fetch(request);
    if (response && response.ok) {
      const runtime = await caches.open(RUNTIME_CACHE);
      await runtime.put(request, response.clone());
    }
    return response;
  } catch (_) {
    return new Response("", { status: 504 });
  }
}

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);
  const isNavigation = event.request.mode === "navigate" ||
    url.pathname.endsWith("/cub-quest/") ||
    url.pathname.endsWith("/cub-quest/index.html");

  if (isNavigation) {
    event.respondWith(navigationResponse(event.request));
    return;
  }

  if (url.origin === self.location.origin && FRESH_FILES.has(url.pathname.split("/").pop())) {
    event.respondWith(networkFirst(event.request));
    return;
  }

  event.respondWith(cacheFirstRuntime(event.request));
});
