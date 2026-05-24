# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # start dev server (opens browser automatically)
npm run build    # production build
npm run preview  # preview production build
```

No test runner is configured yet.

## Architecture

This is a vanilla JS Battleship game using Vite as the bundler. There is no framework — all logic is written as plain ES module classes.

**Core classes (src/):**

- `ship-class.js` — `Ship` class with `name`, `length`, `hits`, `sunk` properties. Has `hit()` (increment hits) and `isSunk()` (check if hits >= length) methods. Currently has a bug in `hit()`: references bare `hits` instead of `this.hits`, and the conditional check is wrong (should increment unconditionally).
- `gameboard-class.js` — `Gameboard` class with a `receiveAttack(coordinates)` method stub. Not yet implemented — needs to track ship placements, hits, and misses.
- `main.js` — Entry point; currently only imports CSS. DOM rendering and game controller logic goes here.
- `style.css` — Global styles.

**Expected game flow to build toward:**
1. Place ships on a `Gameboard` grid
2. Player and computer take turns calling `gameboard.receiveAttack(coordinates)`
3. `receiveAttack` delegates to `ship.hit()` on a hit or records a miss
4. Game ends when all ships on a board report `isSunk()`
