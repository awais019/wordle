<script setup lang="ts">
  import { computed, ref } from "vue";
  import englishWords from "@/englishWordsWith5Letters.json";
  import { VICTORY_MESSAGE, DEFEAT_MESSAGE } from "@/settings";

  defineProps({
    wordOfTheDay: {
      type: String,
      validator: (wordGiven: string) => englishWords.includes(wordGiven),
    },
  });

  const guessInProgress = ref("");
  const guessSubmitted = ref("");

  const formattedGuessInProgress = computed({
    get: () => guessInProgress.value,
    set: (newValue: string) => {
      guessInProgress.value = newValue.slice(0, 5);
    },
  });
</script>

<template>
  <input
    type="text"
    maxlength="5"
    v-model="formattedGuessInProgress"
    @keydown.enter="guessSubmitted = guessInProgress"
  />
  <p
    v-if="guessSubmitted.length > 0"
    v-text="guessSubmitted == wordOfTheDay ? VICTORY_MESSAGE : DEFEAT_MESSAGE"
  ></p>
</template>
