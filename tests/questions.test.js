const test=require('node:test'),assert=require('node:assert'),fs=require('fs'),path=require('path'),vm=require('vm');
const src=fs.readFileSync(path.join(__dirname,'..','questions.js'),'utf8');
const qs=vm.runInNewContext(src+';BUILT_IN_QUESTIONS');
test('every question is well formed',()=>{for(const q of qs){assert.strictEqual(q.length,4,String(q));assert.ok(['mild','medium','spicy','adult'].includes(q[1]),String(q));for(const s of [q[0],q[2],q[3]])assert.ok(s.trim()===s&&s.length>0&&s.length<=90,s);assert.notStrictEqual(q[2],q[3])}});
test('no duplicate questions or repeated options',()=>{const pairs=new Set();for(const q of qs){const k=[q[2],q[3]].sort().join('|').toLowerCase();assert.ok(!pairs.has(k),k);pairs.add(k)}});
