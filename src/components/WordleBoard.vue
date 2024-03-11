<script setup lang="ts">
  import { ref, watch } from "vue";
  import englishWords from "@/englishWordsWith5Letters.json";
  import {
    VICTORY_MESSAGE,
    DEFEAT_MESSAGE,
    MAX_GUESSES_COUNT,
  } from "@/settings";
  import GuessInput from "@/components/GuessInput.vue";

  defineProps({
    wordOfTheDay: {
      type: String,
      required: true,
      validator: (wordGiven: string) => englishWords.includes(wordGiven),
    },
  });
  const guessesSubmitted = ref<string[]>([]);
</script>

<template>
  <main>
    <GuessInput @guess-submitted="(guess) => guessesSubmitted.push(guess)" />

    <p
      v-if="
        guessesSubmitted.length === MAX_GUESSES_COUNT ||
        guessesSubmitted.includes(wordOfTheDay)
      "
      class="end-of-game-message"
      v-text="
        guessesSubmitted.includes(wordOfTheDay)
          ? VICTORY_MESSAGE
          : DEFEAT_MESSAGE
      "
    />
  </main>
</template>

<style scoped>
  main {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 3rem;
  }

  .end-of-game-message {
    font-size: 3rem;
    animation: end-of-game-message-animation 700ms forwards;
    white-space: nowrap;
    text-align: center;
  }

  @keyframes end-of-game-message-animation {
    0% {
      opacity: 0;
      transform: rotateZ(0);
    }
    100% {
      opacity: 1;
      transform: translateY(2rem);
    }
  }
</style>
