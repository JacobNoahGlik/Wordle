// utils/wordlist.js
import rawWordList from './wordlist.txt?raw';

const wordArray = rawWordList.trim().split('\n').map(word => word.toLowerCase());
export const validWords = new Set(wordArray);
export const wordList = wordArray; // For indexed access
