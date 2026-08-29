import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const dist = join(root, "dist");
const client = join(dist, "client");
const server = join(dist, "server");

await rm(dist, { recursive: true, force: true });
await mkdir(client, { recursive: true });
await mkdir(server, { recursive: true });

for (const path of [
  "index.html",
  "badger-game.js",
  "manifest.webmanifest",
  "sw.js",
  "louis.webp",
  "icon-180.png",
  "icon-192.png",
  "icon-512.png",
  "fonts",
  "audio",
]) {
  await cp(join(root, path), join(client, path), { recursive: true });
}

// Keep the large single-file app untouched: load optional mini-games after its
// own script has initialized. Keep Badger Dash permanently available by moving
// its launch button out of the quiz-complete panel and pinning it to the app.
const indexPath = join(client, "index.html");
const indexHtml = await readFile(indexPath, "utf8");
const badgerScripts = `<script src="badger-game.js"></script>
<script>
(function(){
  var btn=document.getElementById("badgerGameBtn");
  if(!btn)return;
  document.body.appendChild(btn);
  btn.classList.add("on");
  btn.style.position="fixed";
  btn.style.right="16px";
  btn.style.bottom="calc(16px + env(safe-area-inset-bottom))";
  btn.style.zIndex="110";
  btn.style.boxShadow="0 8px 24px rgba(0,0,0,.28)";
})();
</script>`;
await writeFile(indexPath, indexHtml.replace("</body>", badgerScripts + "\n</body>"));

try {
  const socialCard = await readFile(join(root, "public", "og.png"));
  await writeFile(join(client, "og.png"), socialCard);
} catch (error) {
  if (error.code !== "ENOENT") throw error;
}

const worker = `export default {
  async fetch(request, env) {
    const response = await env.ASSETS.fetch(request);
    if (response.status !== 404 || request.method !== "GET") return response;

    const url = new URL(request.url);
    if (/\\.[^/]+$/.test(url.pathname)) return response;

    const fallback = new URL("/index.html", url);
    return env.ASSETS.fetch(new Request(fallback, request));
  },
};
`;

await writeFile(join(server, "index.js"), worker);
