<template>
  <div class="app">
    <h1>Wordle</h1>
    <!-- ✅ Now passing currentGuess to Grid -->
    <Grid :guesses="guesses" :targetWord="targetWord" :currentGuess="currentGuess" />
    <Keyboard @keyPress="handleKeyPress" :usedLetters="usedLetters" />
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import Grid from './components/Grid.vue'
import Keyboard from './components/Keyboard.vue'
import { validWords } from './utils/wordlist.js'
import { getWordOfTheDay } from './utils/selectWord.js'

const targetWord = getWordOfTheDay()
const guesses = ref([])
const currentGuess = ref('')
const usedLetters = ref({})

// ✅ Shared key handler (used by both on-screen and physical keyboard)
function handleKeyPress(key) {
  if (key === 'Enter') {
  if (currentGuess.value.length !== 5 || !validWords.has(currentGuess.value.toLowerCase())) return
  const guess = currentGuess.value.toLowerCase()
  guesses.value.push(guess)
  updateUsedLetters(guess) // ✅ This was missing!
  currentGuess.value = ''
} else if (key === 'Backspace') {
    currentGuess.value = currentGuess.value.slice(0, -1)
  } else if (currentGuess.value.length < 5 && /^[a-zA-Z]$/.test(key)) {
    currentGuess.value += key.toLowerCase()
  }
}

// ✅ Keyboard event wrapper
function onKeydown(e) {
  const key = e.key.length === 1 ? e.key.toLowerCase() : e.key
  handleKeyPress(key)
}

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
    } else {
      if (!usedLetters.value[letter]) {
        usedLetters.value[letter] = 'gray'
      }
    }
  }
  console.log('Used letters:', JSON.stringify(usedLetters.value))
}

// ✅ Register/unregister event listeners
onMounted(() => {
  window.addEventListener('keydown', onKeydown)
})
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
})
</script>

<style scoped>
.app {
  max-width: 500px;
  margin: auto;
  text-align: center;
}
</style>
