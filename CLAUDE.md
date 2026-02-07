# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Rocinante is a static rehearsal aid for the play "Besos para la Bella Durmiente" by J. Luis Alonso de Santos. It's a browser-based tool that:
- Displays script lines in high-contrast cards
- Lets actors select their character and hide their own lines during rehearsal
- Uses Web Speech API to narrate other characters' lines, auto-pausing when it's the actor's turn

## Development Commands

```bash
npm install          # Install dependencies
npm run lint         # ESLint with flat config (eslint.config.mjs)
npm run typecheck    # TypeScript strict JS checking (checkJs in tsconfig.json)
npm run ci           # Runs both lint and typecheck
```

## Running Locally

```bash
python3 -m http.server 4173   # or npx serve
# Open http://127.0.0.1:4173/
```

Note: Opening `index.html` directly via `file://` blocks the JSON fetch.

## Architecture

The app uses vanilla ES modules with JSDoc type annotations (no build step, TypeScript only for type-checking).

**Core modules in `src/`:**

- `main.js` - Entry point, initializes the app and loads play data
- `state.js` - Central state object with typed JSDoc definitions (`PlayData`, `Character`, `PlayLine`); manages selected character, speech settings, playback queue
- `dom.js` - DOM element references and UI update functions
- `renderers.js` - Renders play heading, character list, and line cards
- `constants.js` - Language labels and fallback play data

**Services (`src/services/`):**

- `playLoader.js` - Fetches `play.json` with fallback to embedded data
- `speech.js` - Web Speech synthesis: queue management, language detection, voice selection, playback control (play/pause/stop/jump)

**UI (`src/ui/`):**

- `controls.js` - Initializes control panel event listeners
- `handlers.js` - Event handlers for character selection, text size, speech rate, line toggling

**Data flow:** `playLoader` → `state.applyPlayData()` → `renderers` update DOM → `speech` manages narration queue

## Key Patterns

- State is a single mutable object exported from `state.js`
- All DOM queries go through `dom.js` elements cache
- Speech playback uses a queue (`playbackQueue`) that auto-pauses on the selected character's lines
- Language detection prioritizes Spanish (`es-ES`) for the play content
