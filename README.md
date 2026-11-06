# Would You Rather?

A free party game for one shared phone. Tap one of two options, see how earlier votes on this phone split, tap again for the next question. No accounts, server, points, ads or analytics. It works offline and can be installed as an app.

## Features

- 184 built-in questions at three spice levels, plus an opt-in adult mode that is off by default
- Real vote counts, stored only on this phone. The first vote on a question shows 0% / 0% and counts from the next time it appears.
- Your own questions, saved on this phone and mixed in
- Unseen questions come up first
- Optional click sound

The percentages reflect only votes on this device, not players worldwide.

## Run locally

```sh
python3 -m http.server 8000
```

Then open `http://localhost:8000`. Offline mode needs localhost or HTTPS.

## Files

- `index.html`: game and styles
- `questions.js`: question list, written for this project
- `QUESTIONS.md`: readable copy of the list, for review
- `sw.js`, `manifest.json`, `icon-*.png`: offline support and install
- `tests/`: question list checks (`node --test tests/questions.test.js`)
