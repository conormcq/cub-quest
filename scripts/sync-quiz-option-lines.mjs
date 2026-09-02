import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const allAccessPath = join(root, "all-access.js");
const indexPath = join(root, "index.html");
const linesPath = join(root, "audio", "lines.json");
const write = process.argv.includes("--write");

const [allAccess, indexHtml, linesText] = await Promise.all([
  readFile(allAccessPath, "utf8"),
  readFile(indexPath, "utf8"),
  readFile(linesPath, "utf8"),
]);

function objectBetween(source, startMarker, endMarker) {
  const start = source.indexOf(startMarker);
  const end = source.indexOf(endMarker, start + startMarker.length);
  if (start < 0 || end < 0) throw new Error(`Could not find ${startMarker}`);
  const literal = source.slice(start + startMarker.length, end).trim().replace(/;$/, "");
  return Function(`"use strict";return (${literal})`)();
}

function arrange(labels, correctIndex, position) {
  const correct = labels[correctIndex];
  const ordered = labels.filter((_, index) => index !== correctIndex);
  ordered.splice(position, 0, correct);
  return ordered;
}

function optionLine(labels) {
  return `The choices are ${labels[0]}, ${labels[1]}, or ${labels[2]}.`;
}

const bank = objectBetween(allAccess, "var BANK=", "\n\n  var ANIMAL_ICON");
const exact = objectBetween(allAccess, "var EXACT=", "\n\n  /* A few answer words");
const contextual = objectBetween(allAccess, "var CONTEXT_ICONS=", "\n  function iconFor");
const expected = {};
let reviewedPictures = 0;

for (const [animal, questions] of Object.entries(bank)) {
  if (animal === "Badgers") continue;
  for (const question of questions) {
    const [questionText, labels, correctIndex, clip] = question;
    const questionNumber = Number(clip.match(/_q(\d+)$/)?.[1]);
    if (!questionText || labels.length !== 3 || !Number.isFinite(questionNumber)) {
      throw new Error(`Malformed quiz question ${clip}`);
    }
    labels.forEach((label, index) => {
      if (!(contextual[clip]?.[index] || exact[label])) {
        throw new Error(`No reviewed picture for ${clip} answer ${index + 1}: ${label}`);
      }
      reviewedPictures += 1;
    });
    expected[`${clip}_options`] = optionLine(arrange(labels, correctIndex, (questionNumber - 1) % 3));
  }
}

const badgerBlock = indexHtml.slice(
  indexHtml.indexOf("quiz:[", indexHtml.indexOf("var LESSONS=[")),
  indexHtml.indexOf('  ]},\n {id:"fox"'),
);
const badgerQuestion = /\{id:"(qz_badger_[^"]+)", choices:\[([\s\S]*?)\n   \]\}/g;
let match;
let badgerIndex = 0;
while ((match = badgerQuestion.exec(badgerBlock))) {
  const choices = [...match[2].matchAll(/correct:(true|false), alt:"([^"]+)"/g)];
  const labels = choices.map((choice) => choice[2]);
  const correctIndex = choices.findIndex((choice) => choice[1] === "true");
  if (labels.length !== 3 || correctIndex < 0) throw new Error(`Malformed native quiz question ${match[1]}`);
  expected[`${match[1]}_options`] = optionLine(arrange(labels, correctIndex, badgerIndex % 3));
  reviewedPictures += labels.length;
  badgerIndex += 1;
}

if (badgerIndex !== 10) throw new Error(`Expected 10 native badger questions, found ${badgerIndex}`);
if (Object.keys(expected).length !== 88) throw new Error(`Expected 88 option lines, found ${Object.keys(expected).length}`);
if (reviewedPictures !== 264) throw new Error(`Expected 264 reviewed pictures, found ${reviewedPictures}`);

const lines = JSON.parse(linesText);
if (write) {
  Object.assign(lines, expected);
  await writeFile(linesPath, `${JSON.stringify(lines, null, 1)}\n`);
}

const mismatches = Object.entries(expected).filter(([key, value]) => lines[key] !== value);
if (mismatches.length) {
  throw new Error(`${mismatches.length} quiz option narration lines are missing or stale. Run with --write.`);
}

console.log(`Validated ${Object.keys(expected).length} option narrations and ${reviewedPictures} answer pictures.`);
