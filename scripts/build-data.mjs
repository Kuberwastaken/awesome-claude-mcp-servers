#!/usr/bin/env node
// Parse README.md into web/servers.json — the single source of truth for the website.
// The README stays canonical; this keeps the site in sync. Zero dependencies.

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const md = readFileSync(resolve(root, 'README.md'), 'utf8');

// Sections that are not part of the server catalog.
const EXCLUDE = new Set([
  'Contents',
  'How to read this list',
  'Getting started with Claude',
  'Getting started with Codex',
  'Starter kits',
  'Safety and good hygiene',
  'Related lists',
  'Contributing',
]);

const RUNS = new Set(['local', 'remote', 'local/remote']);
const SOURCE = new Set(['reference', 'official', 'archived', 'community']);

const slugify = (s) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

const lines = md.split('\n');
let current = null;
const categories = [];
const servers = [];

for (const line of lines) {
  const heading = line.match(/^##\s+(.+?)\s*$/);
  if (heading) {
    current = heading[1];
    if (!EXCLUDE.has(current) && !categories.includes(current)) categories.push(current);
    continue;
  }
  if (!current || EXCLUDE.has(current)) continue;

  const m = line.match(/^-\s+\[(.+?)\]\((.+?)\)\s+-\s+(.+)$/);
  if (!m) continue;

  const name = m[1];
  const url = m[2];
  let rest = m[3];

  // Peel trailing `chip` tokens off the end; whatever remains is the description.
  const tags = [];
  let chip;
  while ((chip = rest.match(/\s*`([^`]+)`\s*$/))) {
    tags.unshift(chip[1]);
    rest = rest.slice(0, chip.index).replace(/\s+$/, '');
  }

  const runs = tags.find((t) => RUNS.has(t)) || null;
  const source = tags.find((t) => SOURCE.has(t)) || 'community';
  const languages = tags
    .filter((t) => !RUNS.has(t) && !SOURCE.has(t))
    .flatMap((t) => t.split("/")); // "TS/Py" -> ["TS", "Py"]

  servers.push({
    id: slugify(name),
    name,
    url,
    description: rest.replace(/\s+$/, ''),
    category: current,
    languages,
    runs,
    source,
  });
}

const data = {
  generated: 'from README.md by scripts/build-data.mjs',
  count: servers.length,
  categories,
  servers,
};

mkdirSync(resolve(root, 'web'), { recursive: true });
writeFileSync(resolve(root, 'web', 'servers.json'), JSON.stringify(data, null, 2) + '\n');

console.log(`Wrote web/servers.json — ${servers.length} servers across ${categories.length} categories.`);
