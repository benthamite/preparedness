#!/usr/bin/env node
// Build the self-contained page: engine, data, interface and styles in one
// HTML file, which the note embeds in an iframe.
// Usage: node tools/build-page.mjs [--data FILE] [--out FILE]

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const argv = process.argv.slice(2);
function option(name, fallback) {
  const i = argv.indexOf(name);
  return i < 0 ? fallback : argv[i + 1];
}
const dataFile = option('--data', join(root, 'data', 'model.json'));
const outFile = option('--out', join(root, 'dist', 'preparedness-list.html'));

// The page needs the numbers and the display text, not the provenance notes.
function slim(node) {
  if (Array.isArray(node)) return node.map(slim);
  if (node === null || typeof node !== 'object') return node;
  const out = {};
  for (const [k, v] of Object.entries(node)) {
    if (k === 'basis' || k === 'tag' || k === 'provenance') continue;
    out[k] = slim(v);
  }
  return out;
}

const data = slim(JSON.parse(readFileSync(dataFile, 'utf8')));
const engine = readFileSync(join(root, 'src', 'model.mjs'), 'utf8').replace(/^export /gm, '');
const ui = readFileSync(join(root, 'src', 'ui.js'), 'utf8');
const css = readFileSync(join(root, 'src', 'ui.css'), 'utf8');
// "</script" inside the data would end the script element early.
const json = JSON.stringify(data).replace(/<\/(script)/gi, '<\\/$1');

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
<title>Preparedness list</title>
<style>
${css}</style>
</head>
<body>
<div id="controls"></div>
<div class="summary" id="summary"></div>
<div class="owned" id="owned"></div>
<div class="meta">Click an entry for details. Tick what you already have and the rest is re-ranked.</div>
<div class="table-wrap" id="output"></div>
<script type="module">
const DATA = ${json};
${engine}
${ui}
</script>
</body>
</html>
`;
mkdirSync(dirname(outFile), { recursive: true });
writeFileSync(outFile, html);
console.log(`${outFile}: ${(html.length / 1024).toFixed(0)} kB`);
