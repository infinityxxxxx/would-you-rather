#!/usr/bin/env node
// Puts a hash of each script's contents in its URL, so a changed script can never be served from an old browser cache.
// Runs on every commit through .githooks/pre-commit; tests/cache.test.js fails if it was skipped.
const crypto = require('crypto'), fs = require('fs'), path = require('path');

const SCRIPTS = ['questions.js', 'logic.js'];
const OTHER_ASSETS = ['manifest.json', 'icon-192.png', 'icon-512.png'];
const ROOT = path.join(__dirname, '..');
const read = file => fs.readFileSync(path.join(ROOT, file));
const hash = (...parts) => {
  const h = crypto.createHash('sha256');
  parts.forEach(part => h.update(part));
  return h.digest('hex').slice(0, 10);
};

function stamped() {
  let html = read('index.html').toString(), sw = read('sw.js').toString();
  for (const file of SCRIPTS) {
    const name = file.replace('.', '\\.'), version = `${file}?v=${hash(read(file))}`;
    html = html.replace(new RegExp(`(<script src=")${name}(\\?v=\\w+)?(")`), `$1${version}$3`);
    sw = sw.replace(new RegExp(`('\\./)${name}(\\?v=\\w+)?(')`), `$1${version}$3`);
  }
  // A new cache name makes browsers replace the whole offline copy in one go.
  const cache = hash(html, ...[...SCRIPTS, ...OTHER_ASSETS].map(read));
  sw = sw.replace(/const CACHE='[^']*'/, `const CACHE='wyr-${cache}'`);
  return {html, sw};
}

if (require.main === module) {
  const {html, sw} = stamped();
  fs.writeFileSync(path.join(ROOT, 'index.html'), html);
  fs.writeFileSync(path.join(ROOT, 'sw.js'), sw);
}
module.exports = {stamped, SCRIPTS};
