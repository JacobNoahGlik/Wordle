<!-- components/Grid.vue -->
<template>
  <div class="grid">
    <div v-for="(guess, rowIndex) in filledRows" :key="rowIndex" class="row">
      <div
        v-for="(char, i) in guess.split('')"
        :key="i"
        class="cell"
        :class="getColorClass(char, i, guess)"
      >
        {{ char.toUpperCase() }}
      </div>
    </div>

    <!-- Current input row -->
    <div v-if="showCurrentRow" class="row current">
      <div
        v-for="i in 5"
        :key="'current' + i"
        class="cell"
      >
        {{ currentGuess[i - 1]?.toUpperCase() || '' }}
      </div>
    </div>

    <!-- Empty rows -->
    <div
      v-for="i in remainingRows"
      :key="'empty' + i"
      class="row"
    >
      <div
        v-for="j in 5"
        :key="j"
        class="cell"
      ></div>
    </div>
  </div>
</template>

<script setup>
import { computed, toRefs } from 'vue'

const props = defineProps({
  guesses: Array,
  targetWord: String,
  currentGuess: {
    type: String,
    default: ''
  }
})

const { guesses, targetWord, currentGuess } = toRefs(props)

const filledRows = computed(() => guesses.value.slice(0, 6))
const remainingRows = computed(() => 6 - guesses.value.length - (currentGuess.value ? 1 : 0))
const showCurrentRow = computed(() => currentGuess.value.length > 0)

function getColorClass(letter, index, guess) {
  const target = targetWord.value
  if (!target) return ''
  if (target[index] === letter) return 'green'
  else if (target.includes(letter)) return 'yellow'
  else return 'gray'
}
</script>

<style scoped>
.grid {
  display: grid;
  gap: 8px;
}
.row {
  display: flex;
  justify-content: center;
  gap: 5px;
}
.cell {
  width: 50px;
  height: 50px;
  border: 2px solid #ccc;
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-transform: uppercase;
  font-weight: bold;
}
.green {
  background-color: #6aaa64;
  color: white;
}
.yellow {
  background-color: #c9b458;
  color: white;
}
.gray {
  background-color: #787c7e;
  color: white;
}
</style>
