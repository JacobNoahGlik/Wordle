<template>
  <div class="app">
    <h1>Wordle</h1>

    <Grid
      :guesses="guesses"
      :targetWord="targetWord"
      :currentGuess="currentGuess"
      :shakeCurrent="shakeCurrent"
      :bounceRow="bounceRow"
    />

    <!-- put the keyboard back -->
    <Keyboard @keyPress="handleKeyPress" :usedLetters="usedLetters" />

    <!-- actions show when game ends -->
    <div class="actions" v-if="gameOver">
      <button @click="copyScore">📋 Copy Score</button>
      <button @click="clearGuesses">🗑️ Clear Guesses</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed, watch } from 'vue'
import Grid from './components/Grid.vue'
import Keyboard from './components/Keyboard.vue'
import { validWords } from './utils/wordlist.js'
import { getWordOfTheDay, getWordKey } from './utils/selectWord.js'
import confetti from 'canvas-confetti'

const targetWord = getWordOfTheDay()
const dayKey = `wordle:${getWordKey()}`  // per-day storage key

const guesses = ref([])
const currentGuess = ref('')
const usedLetters = ref({})

// animation flags
const shakeCurrent = ref(false)
const bounceRow = ref(-1)

const hasWon = computed(() => guesses.value.includes(targetWord))
const gameOver = computed(() => hasWon.value || guesses.value.length >= 6)

function handleKeyPress(key) {
  if (gameOver.value) return

  if (key === 'Enter') {
    if (currentGuess.value.length !== 5) return triggerShake()
    const guess = currentGuess.value.toLowerCase()
    if (!validWords.has(guess)) return triggerShake()

    guesses.value.push(guess)
    updateUsedLetters(guess)

    if (guess === targetWord) {
      // wait for flip reveal, then bounce + confetti
      const revealMs = 600 + 4 * 160 + 100
      const rowToBounce = guesses.value.length - 1
      setTimeout(() => {
        bounceRow.value = rowToBounce
        launchConfetti()
      }, revealMs)
    } else {
      bounceRow.value = -1
    }
    currentGuess.value = ''
  } else if (key === 'Backspace') {
    currentGuess.value = currentGuess.value.slice(0, -1)
  } else if (/^[a-zA-Z]$/.test(key) && currentGuess.value.length < 5) {
    currentGuess.value += key.toLowerCase()
  }
}

function triggerShake() {
  shakeCurrent.value = true
  setTimeout(() => (shakeCurrent.value = false), 600)
}

function onKeydown(e) {
  const k = e.key.length === 1 ? e.key.toLowerCase() : e.key
  handleKeyPress(k)
}
onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))

// --- on-screen keyboard coloring
function updateUsedLetters(guess) {
  for (let i = 0; i < guess.length; i++) {
    const letter = guess[i]
    const targetLetter = targetWord[i]
    if (letter === targetLetter) {
      usedLetters.value[letter] = 'green'
    } else if (targetWord.includes(letter)) {
      if (usedLetters.value[letter] !== 'green') {
        usedLetters.value[letter] = 'yellow'
      }
    } else if (!usedLetters.value[letter]) {
      usedLetters.value[letter] = 'gray'
    }
  }
}

// --- share score like Wordle (🟩🟨⬛)
function copyScore() {
  const emojiGrid = guesses.value
    .map(word => word.split('').map((ch, i) => {
      if (ch === targetWord[i]) return '🟩'
      if (targetWord.includes(ch)) return '🟨'
      return '⬛'
    }).join(''))
    .join('\n')

  const text = `Wordle Clone — ${guesses.value.length}/6\n${emojiGrid}`
  navigator.clipboard.writeText(text).then(() => {
    alert('Score copied to clipboard!')
  })
}

// --- clear guesses for the current day (keeps today’s word)
function clearGuesses() {
  guesses.value = []
  usedLetters.value = {}
  currentGuess.value = ''
  bounceRow.value = -1
  shakeCurrent.value = false
  localStorage.removeItem(dayKey)
}

// --- confetti
function launchConfetti() {
  const duration = 1800
  const end = Date.now() + duration
  ;(function frame() {
    confetti({
      particleCount: 4,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ['#6aaa64', '#c9b458', '#787c7e']
    })
    confetti({
      particleCount: 4,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ['#6aaa64', '#c9b458', '#787c7e']
    })
    if (Date.now() < end) requestAnimationFrame(frame)
  })()
}

// --- persistence: load/save per-day
onMounted(() => {
  const saved = localStorage.getItem(dayKey)
  if (saved) {
    const s = JSON.parse(saved)
    if (Array.isArray(s.guesses)) {
      guesses.value = s.guesses.slice(0, 6)
      // rebuild usedLetters from saved guesses (authoritative)
      usedLetters.value = {}
      for (const g of guesses.value) updateUsedLetters(g)
    }
  }
})

// save whenever guesses or usedLetters change
watch([guesses, usedLetters], () => {
  localStorage.setItem(dayKey, JSON.stringify({
    guesses: guesses.value,
    usedLetters: usedLetters.value
  }))
}, { deep: true })
</script>

<style scoped>
.app {
  max-width: 560px;
  margin: auto;
  text-align: center;
}
.actions {
  margin-top: 14px;
  display: flex;
  justify-content: center;
  gap: 10px;
}
.actions button {
  padding: 8px 12px;
  border: 0;
  border-radius: 6px;
  background: #3a3a3c;
  color: #fff;
  cursor: pointer;
}
.actions button:hover { filter: brightness(1.1); }
</style>