/* Offline cache for Louis's Animal Lessons.
   Bump CACHE when the site changes, so iPads pick up the new version. */
const CACHE = "cub-quest-v1";
const ASSETS = [
  "./",
  "index.html",
  "manifest.webmanifest",
  "louis.webp",
  "icon-180.png",
  "icon-192.png",
  "icon-512.png",
  "fonts/grandstander.woff2",
  "fonts/nunito.woff2",
  "audio/welcome.mp3",
  "audio/hello.mp3",
  "audio/stripes.mp3",
  "audio/night.mp3",
  "audio/sett.mp3",
  "audio/dig.mp3",
  "audio/worms.mp3",
  "audio/berries.mp3",
  "audio/cubs.mp3",
  "audio/family.mp3",
  "audio/tidy.mp3",
  "audio/nose.mp3",
  "audio/sounds.mp3",
  "audio/party_badger.mp3",
  "audio/party_fox.mp3",
  "audio/party_bat.mp3",
  "audio/fox_hello.mp3",
  "audio/madra.mp3",
  "audio/brush.mp3",
  "audio/earth.mp3",
  "audio/ears.mp3",
  "audio/pounce.mp3",
  "audio/eyes.mp3",
  "audio/whiskers.mp3",
  "audio/foxeats.mp3",
  "audio/bury.mp3",
  "audio/foxcubs.mp3",
  "audio/foxnoises.mp3",
  "audio/bat_hello.mp3",
  "audio/bat_fly.mp3",
  "audio/bat_hands.mp3",
  "audio/bat_ears.mp3",
  "audio/bat_see.mp3",
  "audio/bat_tiny.mp3",
  "audio/bat_eat.mp3",
  "audio/bat_upside.mp3",
  "audio/bat_bigears.mp3",
  "audio/bat_roost.mp3",
  "audio/bat_winter.mp3",
  "audio/bat_pups.mp3"
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE)
      .then((c) => c.addAll(ASSETS))
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

/* Cache first: once it is stored, the network is never needed again. */
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
