# Vue Wordle Clone

A Wordle-like game built with **Vue 3 + Vite**.

- Deterministic **word of the day** (based on **EST** date)
- **HashSet** of valid words for O(1) validation
- **Flip** reveal (top-down), **shake** on invalid/short guesses, **bounce** on win
- On-screen + physical **keyboard** support with live key coloring
- **Confetti** celebration on win 🎉
- **Share score** (🟩🟨⬛) and **Clear guesses**
- **Per-day persistence** in `localStorage` (auto-resets when the day/word changes)

---

## Sample:
<img width="504" height="630" alt="image" src="https://github.com/user-attachments/assets/a552bb7e-042b-46e7-85b5-0a2bed81726f" />

<br>

## Quick Start

**Requirements**
- `Node.js` **18+**
- `npm` (comes with Node)

# 1) Clone
```bash
git clone https://github.com/JacobNoahGlik/Wordle.git
cd Wordle
```
# 2) Install deps
```bash
npm install
```

# 3) Run dev server
```bash
npm run dev
# Vite will print a local URL, usually http://localhost:5173
```

# 4) Build (optional)
```bash
npm run build
npm run preview
```

## Project Structure
```bash
.
├── index.html
├── vite.config.js
├── package.json
├── src/
│   ├── main.js
│   ├── App.vue
│   ├── style.css
│   ├── components/
│   │   ├── Grid.vue
│   │   └── Keyboard.vue
│   └── utils/
│       ├── wordlist.js        # exports wordList (array) and validWords (Set)
│       ├── wordlist.txt       # one 5-letter word per line (lowercase OK)
│       └── selectWord.js      # getWordOfTheDay() + getWordKey() (EST)
```

> Note: `index.html` must be at the repo root (Vite expects it there)
> 
> Add your 5-letter dictionary to `src/utils/wordlist.txt` (one per line)
> 
> `wordlist.js` turns that file into wordList (`array`) and validWords (`Set`)


## How "Word of the Day" Works

`selectWord.js` hashes the **EST calendar date** (`YYYY-MM-DD`) into an index of `wordList`, so everyone gets the same word each day—no network calls required.

* I intentionally use **fixed EST (UTC-5)** for determinism (no DST jumpiness).
* If you prefer **America/New\ York** rules (DST-aware), we can swap the date function.

---

## Features & UX

* **Flip reveal (top-down)** per tile with staggered timing (like original Wordle)
* **Shake** current row when:

  * Pressing **Enter** with < 5 letters
  * Guess not in the valid list
* **Bounce** the solved row on win, then **confetti** runs for \~3s
* **Copy Score** button: copies your attempts as emoji blocks (🟩🟨⬛)
* **Clear Guesses** button: wipes today’s saved attempts
* **Persistence**: your guesses are saved for the current day under a key like `wordle:YYYY-MM-DD`

---

## Troubleshooting

* **Blank page / 404 on root**
  Ensure `index.html` is in the **project root** (not in `public/`).

* **“Unsupported engine” or Vite errors**
  Use Node **18+**. Try `nvm install 20 && nvm use 20`.

* **Imports case-sensitive**
  Import `wordList` with the same casing as exported:

  ```js
  import { wordList, validWords } from './utils/wordlist.js'
  ```

---

## Scripts

* `npm run dev` — Start Vite dev server
* `npm run build` — Production build
* `npm run preview` — Preview the build locally
