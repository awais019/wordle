<script setup lang="ts">
  import { computed, ref } from "vue";
  import englishWords from "@/englishWordsWith5Letters.json";
  import { WORD_SIZE } from "@/settings";

  const emit = defineEmits<{
    "guess-submitted": [guess: string];
  }>();

  const guessInProgress = ref("");

  const formattedGuessInProgress = computed({
    get: () => guessInProgress.value,
    set: (newValue: string) => {
      guessInProgress.value = newValue
        .slice(0, WORD_SIZE)
        .toUpperCase()
        .replace(/[^A-Z]+/gi, "");
    },
  });

  function onSubmit() {
    if (!englishWords.includes(guessInProgress.value)) {
      return;
    }
    emit("guess-submitted", guessInProgress.value);
  }
</script>

<template>
  <ul class="word">
    <li
      v-for="(letter, index) in formattedGuessInProgress.padEnd(WORD_SIZE, ' ')"
      :key="`${letter}-${index}`"
      :data-letter="letter"
      class="letter"
      v-text="letter"
    />
  </ul>

  <input
    v-model="formattedGuessInProgress"
    :maxlength="WORD_SIZE"
    autofocus
    @blur="({target}) => (target as HTMLInputElement).focus()"
    type="text"
    @keydown.enter="onSubmit"
  />
</template>

<style scoped>
  input {
    position: absolute;
    opacity: 0;
  }

  .word {
    list-style: none;
    padding: 0;
    display: flex;
    gap: 0.25rem;
  }

  .letter {
    background-color: white;
    border: 1px solid hsl(0, 0%, 70%);
    width: 5rem;
    height: 5rem;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 2rem;
    font-weight: bolder;
  }

  li:not([data-letter=" "]) {
    animation: pop 100ms;
  }

  @keyframes pop {
    0% {
      transform: scale(1);
    }

    50% {
      transform: scale(1.4);
    }
  }
</style>