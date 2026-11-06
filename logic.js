// Pure game rules, kept apart from the page so tests can run them without a browser.
const CUSTOM_CATEGORY = 'Your questions';
// Off until ticked, so a fresh install never opens with adult or awkward questions.
const OFF_BY_DEFAULT = ['Spicy', 'Adult'];

const categoriesOf = questions => [...new Set(questions.map(q => q.cat))];
const questionsIn = (questions, off) => questions.filter(q => !off.includes(q.cat));

// The two sides always total 100 and neither can be 0 or 100.
function randomSplit(random = Math.random) {
  const a = 1 + Math.floor(random() * 99);
  return {a, b: 100 - a};
}
