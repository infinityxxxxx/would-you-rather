const test=require('node:test'),assert=require('node:assert'),fs=require('fs'),path=require('path'),vm=require('vm');
const read=f=>fs.readFileSync(path.join(__dirname,'..',f),'utf8');
const {randomSplit,questionsIn,categoriesOf,OFF_BY_DEFAULT}=vm.runInNewContext(read('logic.js')+';({randomSplit,questionsIn,categoriesOf,OFF_BY_DEFAULT})');

test('random split stays within 1-99 and totals 100',()=>{
  for(const r of [0,.5,.999999]){const s=randomSplit(()=>r);assert.ok(s.a>=1&&s.a<=99&&s.b>=1&&s.b<=99,JSON.stringify(s));assert.strictEqual(s.a+s.b,100)}
  assert.strictEqual(randomSplit(()=>0).a,1);
  assert.strictEqual(randomSplit(()=>.999999).a,99);
});
test('several categories can be selected at once',()=>{
  const q=[{cat:'Funny'},{cat:'Food'},{cat:'Deep'}];
  assert.deepStrictEqual(Array.from(questionsIn(q,['Deep'])).map(x=>x.cat),['Funny','Food']);
  assert.strictEqual(questionsIn(q,['Funny','Food','Deep']).length,0);
});
test('adult and spicy categories exist and are off by default',()=>{
  const qs=vm.runInNewContext(read('questions.js')+';BUILT_IN_QUESTIONS').map(([cat])=>({cat}));
  const cats=categoriesOf(qs);
  for(const c of OFF_BY_DEFAULT)assert.ok(cats.includes(c),c);
  assert.ok(!Array.from(questionsIn(qs,OFF_BY_DEFAULT)).some(q=>q.cat==='Adult'));
});
test('removed copy and the question counter stay gone',()=>{
  const html=read('index.html');
  assert.ok(!html.includes('Argue about it'));
  assert.ok(!html.includes('id="count"'));
});
