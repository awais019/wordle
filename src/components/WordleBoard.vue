<script setup lang="ts">
  import { ref } from "vue";
  import { VICTORY_MESSAGE, DEFEAT_MESSAGE } from "@/settings";

  defineProps({
    wordOfTheDay: {
      type: String,
      validator: (wordGiven: string) => wordGiven.length == 5,
    },
  });

  const guessInProgress = ref("");
  const guessSubmitted = ref("");
</script>

<template>
  <input
    type="text"
    v-model="guessInProgress"
    @keydown.enter="guessSubmitted = guessInProgress"
  />
  <p
    v-if="guessSubmitted.length > 0"
    v-text="guessSubmitted == wordOfTheDay ? VICTORY_MESSAGE : DEFEAT_MESSAGE"
  ></p>
</template>
