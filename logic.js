// Pure game rules, kept apart from the page so tests can run them without a browser.
const CUSTOM_CATEGORY = 'Your questions';
// Off until ticked, so a fresh install never opens with adult or awkward questions.
const OFF_BY_DEFAULT = ['Spicy', 'Adult'];

const categoriesOf = questions => [...new Set(questions.map(q => q.cat))];
const questionsIn = (questions, off) => questions.filter(q => !off.includes(q.cat));

// Made-up but believable: tied to the question id, so a question shows the same split every time it comes up.
const SPLIT_MIN = 18;
function splitFor(id) {
  let h = 2166136261;
  for (let i = 0; i < id.length; i++) h = Math.imul(h ^ id.charCodeAt(i), 16777619);
  // Final mix, because custom question ids differ only in their last few digits.
  h ^= h >>> 15; h = Math.imul(h, 2246822519); h ^= h >>> 13;
  const a = SPLIT_MIN + (h >>> 0) % (101 - 2 * SPLIT_MIN);
  return {a, b: 100 - a};
}
