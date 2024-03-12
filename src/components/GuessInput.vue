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
  const hasFailedValidation = ref<boolean>(false);

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
      hasFailedValidation.value = true;
      setTimeout(() => (hasFailedValidation.value = false), 500);

      return;
    }
    emit("guess-submitted", guessInProgress.value);
    guessInProgress.value = "";
  }
</script>

<template>
  <GuessView
    v-if="!disabled"
    :class="{ shake: hasFailedValidation }"
    :guess="formattedGuessInProgress"
  />

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
  .shake {
    animation: shake;
    animation-duration: 100ms;
    animation-iteration-count: 2;
  }
  @keyframes shake {
    0% {
      transform: translateX(-2%);
    }
    25% {
      transform: translateX(0);
    }
    50% {
      transform: translateX(2%);
    }
    75% {
      transform: translateX(0);
    }
  }
</style>
