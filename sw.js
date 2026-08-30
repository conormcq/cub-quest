/* Cub Quest offline/update strategy.
   - App shell is versioned and refreshed on each release.
   - Narration/audio is kept in a persistent runtime cache across releases.
   - Navigations are network-first, with the cached app as offline fallback.
   - Audio has a dedicated Range-aware path for iOS/Safari media playback. */
const SHELL_CACHE = "cub-quest-shell-v28";
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
  "games/publish-games.js",
  "games/game-lab.js",
  "ios-audio-unlock.js",
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
  "games/publish-games.js",
  "games/game-lab.js",
  "ios-audio-unlock.js",
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
        if (response && response.status === 200) await runtime.put(new Request(request.url), response);
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
    if (response && response.ok && response.status === 200) {
      const runtime = await caches.open(RUNTIME_CACHE);
      await runtime.put(request, response.clone());
    }
    return response;
  } catch (_) {
    return new Response("", { status: 504 });
  }
}

async function cacheFullAudio(url){
  try {
    const fullRequest = new Request(url, { method: "GET", cache: "no-store" });
    const full = await fetch(fullRequest);
    if (full && full.ok && full.status === 200) {
      const runtime = await caches.open(RUNTIME_CACHE);
      await runtime.put(new Request(url), full.clone());
    }
  } catch (_) {}
}

async function rangedFromCachedAudio(request){
  const range = request.headers.get("Range");
  if (!range) return null;

  const cached = await caches.match(new Request(request.url), {
    cacheName: RUNTIME_CACHE,
    ignoreSearch: true
  });
  if (!cached || cached.status !== 200) return null;

  const match = /^bytes=(\d+)-(\d*)$/i.exec(range.trim());
  if (!match) return cached;

  const buffer = await cached.arrayBuffer();
  const total = buffer.byteLength;
  const start = Math.min(parseInt(match[1], 10), Math.max(total - 1, 0));
  const requestedEnd = match[2] ? parseInt(match[2], 10) : total - 1;
  const end = Math.min(requestedEnd, total - 1);
  if (end < start) return new Response(null, {
    status: 416,
    headers: { "Content-Range": "bytes */" + total }
  });

  const headers = new Headers(cached.headers);
  headers.set("Accept-Ranges", "bytes");
  headers.set("Content-Range", "bytes " + start + "-" + end + "/" + total);
  headers.set("Content-Length", String(end - start + 1));
  headers.set("Cache-Control", "no-store");
  return new Response(buffer.slice(start, end + 1), { status: 206, headers });
}

async function audioResponse(request, event){
  /* Safari/iOS commonly requests MP3s using Range. Let the origin answer that
     request when online; this avoids serving an incompatible cached response. */
  try {
    const fresh = await fetch(request, { cache: "no-store" });
    if (fresh && fresh.ok) {
      if (request.headers.has("Range")) {
        if (event) event.waitUntil(cacheFullAudio(request.url));
      } else if (fresh.status === 200) {
        const runtime = await caches.open(RUNTIME_CACHE);
        if (event) event.waitUntil(runtime.put(new Request(request.url), fresh.clone()));
      }
      return fresh;
    }
  } catch (_) {}

  /* Offline: synthesize the byte-range response Safari expects from a cached
     full MP3. Non-range requests can use the full cached response directly. */
  if (request.headers.has("Range")) {
    const partial = await rangedFromCachedAudio(request);
    if (partial) return partial;
  }

  return (await caches.match(new Request(request.url), {
    cacheName: RUNTIME_CACHE,
    ignoreSearch: true
  })) || new Response("", { status: 504 });
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

  if (url.origin === self.location.origin && url.pathname.includes("/audio/") && url.pathname.endsWith(".mp3")) {
    event.respondWith(audioResponse(event.request, event));
    return;
  }

  if (url.origin === self.location.origin && FRESH_FILES.has(url.pathname.split("/").pop())) {
    event.respondWith(networkFirst(event.request));
    return;
  }

  event.respondWith(cacheFirstRuntime(event.request));
});
