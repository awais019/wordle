<script setup lang="ts">
  import { VICTORY_MESSAGE } from "@/settngs";

  defineProps<{
    wordOfTheDay: string;
  }>();
</script>

<template>
  <input type="text" />
  <p>{{ VICTORY_MESSAGE }}</p>
  <p>Better luck next time!</p>
</template>
