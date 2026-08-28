# Cub Quest

An offline-capable web app: badgers, foxes and bats read aloud, with the words
highlighted as they are spoken.

## Putting it on GitHub Pages

The repo already exists: https://github.com/conormcq/cub-quest

### Option A — drag and drop, no command line

1. Open https://github.com/conormcq/cub-quest and click **uploading an existing file**.
2. Unzip this bundle, open the folder, select **everything inside it** and drag it
   into the browser. On macOS press **Cmd+Shift+.** first so Finder shows the
   hidden `.nojekyll` file, or it will be left behind.
3. Commit.

### Option B — three commands in your own Terminal

```sh
cd <the unzipped folder>
git init && git add -A && git commit -m "Cub Quest"
git branch -M main
git remote add origin https://github.com/conormcq/cub-quest.git
git push -u origin main
```

### Then, either way

*Settings -> Pages*. Under **Source** pick *Deploy from a branch*, choose `main`
and `/ (root)`, then **Save**. A minute later the site is at

`https://conormcq.github.io/cub-quest/`

## Putting it on the iPad

1. Open that address in **Safari** (it must be Safari, not Chrome).
2. Let it finish loading once, on wifi. That is when it stores itself for offline use.
3. Share button -> **Add to Home Screen**.

You get a Louis icon named "Cub Quest". It opens full screen with no browser
toolbars, and it works with the wifi off from then on.

## Changing it later

Re-upload the changed files, and bump `CACHE` in `sw.js` (`cub-quest-v6` -> `-v7`). Without that bump, iPads keep serving the old cached copy.

## What is in here

- `index.html` — the whole app: markup, styles, illustrations, read-along logic
- `audio/` — 40 narration clips (Kokoro-82M, voice `bf_alice`)
- `fonts/` — the two typefaces, shipped so the page looks right offline
- `sw.js` — the service worker that makes it work offline
- `manifest.webmanifest` — name, icons and full-screen behaviour
- `.nojekyll` — stops GitHub trying to process the files
