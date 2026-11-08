# FirstProject

Building a consumer app: website first, then iPhone/Android from the same code.

## Folders

| Folder | What it is |
|--------|------------|
| `coffee-app/` | **The real app.** Expo + React Native + TypeScript. Runs as a website now, and on phones later. |
| `01-javascript-basics/` | Learning exercise: JavaScript compared to R |
| `02-interactive-page/` | Learning exercise: a plain HTML/JavaScript page |

## Roadmap

| Step | What | Status |
|------|------|--------|
| 1 | JavaScript basics | ✅ |
| 2 | Interactive page | ✅ |
| 3 | Real app structure (web + mobile ready) with automated tests | ✅ |
| 4 | Save data so it survives a page refresh | ⬜ |
| 5 | Multiple screens (navigation) | ⬜ |
| 6 | Fetch live data from the internet | ⬜ |
| 7 | Put the website online | ⬜ |
| 8 | Run on your phone with Expo Go | ⬜ |

## Running the app on your computer

You need [Node.js](https://nodejs.org) (the LTS version) installed. Then:

```bash
cd coffee-app
npm install       # first time only: downloads the libraries
npm run web       # opens the app in your browser
```

## Testing

From `coffee-app/`:

```bash
npm run typecheck    # checks types (catches typos and wrong data types)
npm test             # unit tests for the logic in src/core
npx playwright install   # first time only: downloads test browsers
npm run test:e2e     # builds the website and clicks through it in a real browser
npm run check        # all of the above
```

## How the app is organised

```
coffee-app/
  App.tsx                    entry point
  src/
    core/                    the app's rules and calculations: no screen code
      purchases.ts             works on web AND phones unchanged
      purchases.test.ts        unit tests (like testthat in R)
    screens/
      TrackerScreen.tsx      what the user sees and taps
    theme.ts                 colours (light + dark mode)
  e2e/
    tracker.spec.ts          browser tests that act like a real user
```

Keeping the logic (`core/`) apart from the screens is what makes the
mobile port easy: the logic and tests move over untouched.
