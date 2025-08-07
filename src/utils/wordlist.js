// src/utils/wordlist.js
import rawWordList from './wordlist.txt?raw'

// Handle LF/CRLF and lowercase everything
export const wordList = rawWordList
  .trim()
  .split(/\r?\n/)
  .map(w => w.toLowerCase())

export const validWords = new Set(wordList)