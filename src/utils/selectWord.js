// utils/selectWord.js
import { wordList } from './wordlist';

function getESTDateSeed() {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const estOffset = -5 * 60; // EST = UTC-5
  const estTime = new Date(utc + estOffset * 60000);
  return estTime.toISOString().split('T')[0]; // 'YYYY-MM-DD'
}

function hashDateToIndex(dateStr, max) {
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = (hash * 31 + dateStr.charCodeAt(i)) % 1000000;
  }
  return hash % max;
}

export function getWordOfTheDay() {
  const seed = getESTDateSeed();
  const index = hashDateToIndex(seed, wordList.length);
  return wordList[index];
}
