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
  <input
    type="text"
    :maxlength="WORD_SIZE"
    v-model="formattedGuessInProgress"
    @keydown.enter="onSubmit"
  />
</template>
