<script setup lang="ts">
  import { computed, ref } from "vue";
  import englishWords from "@/englishWordsWith5Letters.json";
  import { WORD_SIZE } from "@/settings";
  import GuessView from "@/components/GuessView.vue";

  withDefaults(defineProps<{ disabled?: boolean }>(), { disabled: false });

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
    guessInProgress.value = "";
  }
</script>

<template>
  <GuessView :guess="formattedGuessInProgress" />

  <input
    v-model="formattedGuessInProgress"
    :maxlength="WORD_SIZE"
    :disabled="disabled"
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
</style>
