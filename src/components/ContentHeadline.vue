<template>
    <h1 class="text-3xl font-bold relative mb-5 text-white drop-shadow-[0_0_5px_rgba(200,255,255,0.6)]       
      ">{{ text }}</h1>
</template>

<script setup lang="ts">
defineProps<{
    text: string;
}>();
</script>