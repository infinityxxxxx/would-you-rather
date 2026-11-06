const test=require('node:test'),assert=require('node:assert'),fs=require('fs'),path=require('path');
const {stamped,SCRIPTS}=require('../scripts/stamp.js');
const read=f=>fs.readFileSync(path.join(__dirname,'..',f),'utf8');

test('script versions match the current files (run scripts/stamp.js)',()=>{
  const {html,sw}=stamped();
  assert.strictEqual(read('index.html'),html);
  assert.strictEqual(read('sw.js'),sw);
});
test('every script the page loads is versioned and available offline',()=>{
  const sw=read('sw.js'),urls=[...read('index.html').matchAll(/<script src="([^"]+)"/g)].map(m=>m[1]);
  assert.strictEqual(urls.length,SCRIPTS.length,'add new scripts to SCRIPTS in scripts/stamp.js');
  for(const url of urls){assert.match(url,/\?v=[0-9a-f]{10}$/);assert.ok(sw.includes(`'./${url}'`),url)}
});
