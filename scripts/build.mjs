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
