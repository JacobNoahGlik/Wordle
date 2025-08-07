<template>
  <div class="keyboard">
    <div v-for="row in rows" :key="row" class="key-row">
      <button
        v-for="key in row"
        :key="key"
        @click="handleKeyPress(key)"
        :class="['key', keyColorClass(key)]"
      >
        {{ key }}
      </button>
    </div>
  </div>
</template>

<script setup>
const emit = defineEmits(['keyPress'])

const props = defineProps({
  usedLetters: {
    type: Object,
    default: () => ({})
  }
})

const rows = [
  ['Q','W','E','R','T','Y','U','I','O','P'],
  ['A','S','D','F','G','H','J','K','L'],
  ['Enter','Z','X','C','V','B','N','M','Backspace']
]

function handleKeyPress(key) {
  emit('keyPress', key)
  guesses.value.push(currentGuess.value.toLowerCase())
  updateUsedLetters(currentGuess.value.toLowerCase())
  console.log('Keyboard received:', props.usedLetters)
}

function keyColorClass(key) {
  const status = props.usedLetters[key.toLowerCase()]
  return status || ''
}
</script>

<style scoped>
.key {
  margin: 2px;
  padding: 10px;
  border: none;
  border-radius: 4px;
  min-width: 40px;
  font-size: 14px;
  text-transform: uppercase;
  background-color: #d3d6da;
  cursor: pointer;
}

.green {
  background-color: #6aaa64 !important;
  color: white;
}

.yellow {
  background-color: #c9b458 !important;
  color: white;
}

.gray {
  background-color: #787c7e !important;
  color: white;
}
</style>
