#!/usr/bin/env node

'use strict';

const assert = require('assert');
const child_process = require('child_process');
const fs = require('fs');
const path = require('path');

const cli = process.argv[2];

// Lists the images stored in the given directory. The returned paths have `dir`
// prepended to them.
function listImages(dir) {
  return fs.readdirSync(dir)
    .filter(file => file.match(/\.(jpg|png|gif)$/i))
    .map(file => path.join(dir, file));
}

// ASCIIfies the assets stored in the given directory.
function asciify(dir) {
  const sourceDir = `assets/${dir}`;
  const targetDir = `assets/${dir}-ascii`;
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir);
  }
  for (const source of listImages(sourceDir)) {
    const target = path.join(targetDir, path.parse(source).name + '.jpg');
    console.log(`asciifying ${source} => ${target}`);

    child_process.spawnSync(cli, [
      "--font", "/System/Library/Fonts/Menlo.ttc",
      "--ascii-width", "70",
      "--font-height", "10",
      source, target
    ]);
  }
}
assert(cli);

asciify('silicon-dawn');
asciify('rider-waite-smith');
