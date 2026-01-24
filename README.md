# Besos para la Bella Durmiente – Rehearsal MVP

Static rehearsal aid for the play “Besos para la Bella Durmiente” by J. Luis Alonso de Santos.  
Features:
- Loads the script from `play.json`, shows all lines with large, high‑contrast cards.
- Lets an actor pick their character, hide their own lines, and follow along via Web Speech with adjustable speed and language/voice selection.
- Displays the line currently being narrated and automatically pauses so the actor can jump in when their cue arrives.

## Run Locally

```bash
python3 -m http.server 4173
# open http://127.0.0.1:4173/ in a browser (Safari/Chrome/Edge)
```

Opening `index.html` directly with `file://` blocks the JSON fetch, so always use a tiny static server (the python command above or `npx serve`).

## Deployment

Because it’s a static site, any static host works:
1. Upload the repo to Netlify, Vercel, GitHub Pages, S3/CloudFront, etc.
2. Ensure `index.html`, `styles.css`, `app.js`, and `play.json` sit in the same directory—no build step required.
3. Hit the deployed URL; the runtime fetches `play.json` relative to the root.

## Customizing the Play

Edit `play.json` with your own characters and `lines`. Each line accepts an array of `characterIds` (to support cues with overlapping voices). Keep the file JSON‑valid—use a formatter or `python3 -m json.tool play.json` to verify before serving.

## Known Limitations

- No scene navigator yet (playback always goes from the start); adding a “skip to cue” UI would be the next enhancement.
- Web Speech availability/voices depend on the browser. When speech synthesis isn’t supported, the UI falls back to manual reading.

## Development & CI

Install Node 18+ and run:

```bash
npm install
npm run lint        # ESLint 9 flat config
npm run typecheck   # TypeScript strict JS checking
npm run ci          # runs both (useful for GitHub Actions)
```
