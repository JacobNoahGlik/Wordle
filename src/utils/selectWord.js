// src/utils/selectWord.js
import { wordList } from './wordlist.js'

function getESTDateSeed() {
  const now = new Date()
  const utc = now.getTime() + now.getTimezoneOffset() * 60000
  const estOffsetMinutes = -5 * 60 // fixed EST (no DST) for determinism
  const estTime = new Date(utc + estOffsetMinutes * 60000)
  return estTime.toISOString().split('T')[0] // 'YYYY-MM-DD'
}

function hashDateToIndex(dateStr, max) {
  let hash = 0
  for (let i = 0; i < dateStr.length; i++) {
    hash = (hash * 31 + dateStr.charCodeAt(i)) % 1000000
  }
  return hash % max
}

export function getWordOfTheDay() {
  const seed = getESTDateSeed()
  const index = hashDateToIndex(seed, wordList.length)
  return wordList[index]
}

export function getWordKey() {
  return getESTDateSeed() // used for per-day localStorage key
}
