import { copyFile, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const voiceRoot = process.env.CUB_QUEST_VOICE_ROOT || join(root, "..", "cub-quest-voice");
const appLinesPath = join(root, "audio", "lines.json");
const appTimingsPath = join(root, "audio", "timings.json");
const voiceLinesPath = join(voiceRoot, "audio", "lines.json");
const voiceTimingsPath = join(voiceRoot, "voice_out", "timings.json");
const voiceAudioDir = join(voiceRoot, "voice_out", "audio");

const readJson = async (path) => JSON.parse(await readFile(path, "utf8"));
const [appLines, appTimings, voiceLines, voiceTimings] = await Promise.all([
  readJson(appLinesPath),
  readJson(appTimingsPath),
  readJson(voiceLinesPath),
  readJson(voiceTimingsPath),
]);

const gameKeys = Object.keys(appLines).filter((key) => key.startsWith("game_")).sort();
if (gameKeys.length !== 58) throw new Error(`Expected 58 game narration lines, found ${gameKeys.length}`);

for (const key of gameKeys) {
  if (voiceLines[key] !== appLines[key]) throw new Error(`Narration text mismatch for ${key}`);
  if (!voiceTimings[key]) throw new Error(`Missing generated timings for ${key}`);
  await copyFile(join(voiceAudioDir, `${key}.mp3`), join(root, "audio", `${key}.mp3`));
  appTimings[key] = voiceTimings[key];
}

await writeFile(appTimingsPath, `${JSON.stringify(appTimings)}\n`);
console.log(`Synchronized ${gameKeys.length} Chatterbox game narration clips and timings.`);
