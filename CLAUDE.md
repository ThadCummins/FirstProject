# Project notes for Claude

The owner is learning to code (background: R for statistics). Explain new
concepts briefly, relating them to R where it helps.

## Goal
A consumer app. Built as a website first, then ported to iPhone/Android.
The real app lives in `coffee-app/` (Expo + React Native + TypeScript).
`01-*` and `02-*` are earlier learning exercises; leave them as they are.

## Rules that keep the mobile port easy
- **Logic goes in `coffee-app/src/core/`.** Pure TypeScript only: no React,
  no `react-native`, no `window`/`document`/`localStorage`. Every core
  function gets unit tests next to it (`*.test.ts`).
- **Screens use React Native components only** (`View`, `Text`, `TextInput`,
  `Pressable`, `ScrollView`, `StyleSheet`). Never HTML tags (`div`, `button`)
  or CSS files.
- **Anything platform-specific** (storage, notifications, etc.) goes behind a
  small interface, using Expo libraries that support web, iOS and Android.
- **Colours come from `src/theme.ts`**, with light and dark versions.
- Add `testID`s to anything a browser test needs to find.
- Install packages with `npx expo install <pkg>` (prefix with `EXPO_OFFLINE=1`
  in the cloud sandbox, where Expo's API is blocked).

## Before saying a change is done
From `coffee-app/`:
```bash
npm run typecheck
npm test
CHROMIUM_PATH=/opt/pw-browsers/chromium EXPO_OFFLINE=1 npm run test:e2e   # cloud sandbox
```
Add or update tests for every new feature.
