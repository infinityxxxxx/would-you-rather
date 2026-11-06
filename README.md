# Would You Rather?

A free party game for one shared phone. Tap one of two options, see a percentage split, tap again for the next question. No accounts, server, points, ads or analytics. It works offline and can be installed as an app.

## Features

- 184 built-in questions in 13 categories. Pick as many as you like; Spicy and Adult are off by default.
- A made-up split for each question (18-82%, always totalling 100), the same every time that question comes up. No votes are counted, so the numbers are just for fun.
- Your own questions, saved on this phone and mixed in
- Unseen questions come up first
- Optional click sound

## Run locally

```sh
python3 -m http.server 8000
```

Then open `http://localhost:8000`. Offline mode needs localhost or HTTPS.

## Files

- `index.html`: game and styles
- `logic.js`: category filtering and the made-up split
- `questions.js`: question list, written for this project
- `QUESTIONS.md`: readable copy of the list, for review
- `sw.js`, `manifest.json`, `icon-*.png`: offline support and install
- `tests/`: question list and game rule checks (`node --test tests/*.test.js`)
