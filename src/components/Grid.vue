<template>
  <div class="grid">
    <!-- Submitted rows -->
    <div
      v-for="(guess, rowIndex) in filledRows"
      :key="rowIndex"
      class="row"
      :class="{ bounce: rowIndex === bounceRow }"
    >
      <div v-for="(char, i) in guess.split('')" :key="i" class="cell">
        <div
            class="flip-container"
            :class="{
                flip: rowIndex === (guesses.length - 1),      // animate newest row
                revealed: rowIndex <= (guesses.length - 1)    // ALL submitted rows stay flipped
            }"
            :style="{ '--d': `${i * 160}ms` }"
        >
          <div class="face front">
            {{ char.toUpperCase() }}
          </div>
          <div class="face back" :class="rowColors[rowIndex][i]">
            {{ char.toUpperCase() }}
          </div>
        </div>
      </div>
    </div>

    <!-- Current input row (can shake) -->
    <div class="row current" :class="{ shake: shakeCurrent }" v-if="showCurrentRow">
      <div v-for="i in 5" :key="'current' + i" class="cell">
        {{ currentGuess[i - 1]?.toUpperCase() || '' }}
      </div>
    </div>

    <!-- Empty rows -->
    <div v-for="i in remainingRows" :key="'empty' + i" class="row">
      <div v-for="j in 5" :key="j" class="cell"></div>
    </div>
  </div>
</template>

<script setup>
import { computed, toRefs } from 'vue'

const props = defineProps({
  guesses: Array,
  targetWord: String,
  currentGuess: { type: String, default: '' },
  shakeCurrent: { type: Boolean, default: false },
  bounceRow: { type: Number, default: -1 }
})

const { guesses, targetWord, currentGuess, shakeCurrent, bounceRow } = toRefs(props)

const filledRows = computed(() => guesses.value.slice(0, 6))
const remainingRows = computed(() =>
  6 - guesses.value.length - (currentGuess.value ? 1 : 0)
)
const showCurrentRow = computed(() => currentGuess.value.length > 0)

/* Precompute color arrays per submitted guess */
const rowColors = computed(() => filledRows.value.map(g => colorsFor(g)))

/* Wordle-correct coloring with counts */
function colorsFor(guess) {
  const target = targetWord.value || ''
  const res = Array(5).fill('gray')
  const counts = {}

  if (typeof guess !== 'string' || guess.length !== 5 || target.length !== 5) {
    return res
  }

  for (let i = 0; i < 5; i++) {
    const c = target[i]
    counts[c] = (counts[c] || 0) + 1
  }
  for (let i = 0; i < 5; i++) {
    if (guess[i] === target[i]) {
      res[i] = 'green'
      counts[guess[i]]--
    }
  }
  for (let i = 0; i < 5; i++) {
    const g = guess[i]
    if (res[i] !== 'green' && counts[g] > 0) {
      res[i] = 'yellow'
      counts[g]--
    }
  }
  return res
}
</script>

<style scoped>
.grid { display: grid; gap: 8px; }
.row { display: flex; justify-content: center; gap: 5px; }
.cell {
  width: 50px; height: 50px;
  border: 2px solid #3a3a3c;
  display: flex; align-items: center; justify-content: center;
  font-size: 24px; font-weight: bold; text-transform: uppercase;
  perspective: 800px; background: transparent;
}

/* Flip containers flip around X-axis (top->down), like Wordle */
.flip-container {
  position: relative;
  width: 100%; height: 100%;
  transform-style: preserve-3d;
  transform-origin: center center;
}

/* newest submitted row: animate reveal with stagger */
.flip {
  animation: flipTileX 600ms ease both; /* 'both' keeps final transform */
  animation-delay: var(--d);
}
.revealed {
  transform: rotateX(180deg);
}

/* older rows: already revealed (no animation) */
.flipped { transform: rotateX(180deg); }

.face {
  position: absolute; inset: 0; border-radius: 4px;
  display: flex; align-items: center; justify-content: center;
  backface-visibility: hidden; border: 2px solid #3a3a3c;
}
.front { background: #121213; color: #fff; }
.back  { transform: rotateX(180deg); color: #fff; }

.green  { background-color: #6aaa64; border-color: #6aaa64; }
.yellow { background-color: #c9b458; border-color: #c9b458; }
.gray   { background-color: #3a3a3c; border-color: #3a3a3c; }

/* Flip animation: X-axis (top-down) */
@keyframes flipTileX {
  0%   { transform: rotateX(0); }
  45%  { transform: rotateX(90deg); }
  55%  { transform: rotateX(90deg); }
  100% { transform: rotateX(180deg); }
}

/* Shake for invalid word / short guess (current row) */
.shake {
  animation: shakeRow 600ms cubic-bezier(.36,.07,.19,.97) both;
}
@keyframes shakeRow {
  10%, 90% { transform: translateX(-2px); }
  20%, 80% { transform: translateX(4px); }
  30%, 50%, 70% { transform: translateX(-6px); }
  40%, 60% { transform: translateX(6px); }
}

/* Bounce on win (submitted row), tiles stagger via --d */
/* bounce should also preserve its end state */
.row.bounce .flip-container {
  animation: bounceTile 650ms ease both;
  animation-delay: var(--d);
}
@keyframes bounceTile {
  0%   { transform: rotateX(180deg) translateY(0); }
  30%  { transform: rotateX(180deg) translateY(-10px); }
  55%  { transform: rotateX(180deg) translateY(0); }
  70%  { transform: rotateX(180deg) translateY(-5px); }
  100% { transform: rotateX(180deg) translateY(0); }
}
</style>
