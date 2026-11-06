const test=require('node:test'),assert=require('node:assert'),fs=require('fs'),path=require('path'),vm=require('vm');
const read=f=>fs.readFileSync(path.join(__dirname,'..',f),'utf8');
const {splitFor,questionsIn,categoriesOf,OFF_BY_DEFAULT}=vm.runInNewContext(read('logic.js')+';({splitFor,questionsIn,categoriesOf,OFF_BY_DEFAULT})');

test('a question always gets the same believable split',()=>{
  const seen=new Set();
  for(let i=0;i<500;i++){const id='q'+i.toString(36),s=splitFor(id);assert.deepStrictEqual({...splitFor(id)},{...s});assert.ok(s.a>=18&&s.a<=82,JSON.stringify(s));assert.strictEqual(s.a+s.b,100);seen.add(s.a)}
  assert.ok(seen.size>=40,'splits should vary between questions: '+seen.size);
  assert.ok(new Set(Array.from({length:50},(_,i)=>splitFor('c17930000000'+i).a)).size>=20,'near-identical custom ids should still vary');
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
