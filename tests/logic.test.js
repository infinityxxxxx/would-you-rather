const test=require('node:test'),assert=require('node:assert'),fs=require('fs'),path=require('path'),vm=require('vm');
const read=f=>fs.readFileSync(path.join(__dirname,'..',f),'utf8');
const {splitFor,questionsIn,categoriesOf,initialOffCats,OFF_BY_DEFAULT}=vm.runInNewContext(read('logic.js')+';({splitFor,questionsIn,categoriesOf,initialOffCats,OFF_BY_DEFAULT})');

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
test('a first visit starts with every category unticked',()=>{
  const qs=vm.runInNewContext(read('questions.js')+';BUILT_IN_QUESTIONS').map(([cat])=>({cat}));
  const cats=categoriesOf(qs);
  for(const c of OFF_BY_DEFAULT)assert.ok(cats.includes(c),c);
  assert.strictEqual(questionsIn(qs,initialOffCats(null,cats)).length,0);
});
test('saved category picks are kept on later visits',()=>{
  const cats=['Funny','Food','Spicy','Adult'];
  assert.deepStrictEqual(Array.from(initialOffCats({offCats:['Food']},cats)),['Food']);
  assert.strictEqual(initialOffCats({offCats:[]},cats).length,0);
});
test('saves from the old spice picker keep their choices',()=>{
  const cats=['Funny','Spicy','Adult'];
  assert.deepStrictEqual(Array.from(initialOffCats({sound:true},cats)),['Spicy','Adult']);
  assert.deepStrictEqual(Array.from(initialOffCats({spice:'spicy',adult:true},cats)),[]);
});
test('removed copy and the question counter stay gone',()=>{
  const html=read('index.html');
  assert.ok(!html.includes('Argue about it'));
  assert.ok(!html.includes('just for fun'));
  assert.ok(!html.includes('id="count"'));
});
