<template>
  <div class="min-h-screen bg-green-900 text-white">
    <Header />
    <GooeySquares />
    <Content />
  </div>
</template>

<script setup lang="ts">
import Header from './components/Header.vue'
import GooeySquares from './components/GooeySquares.vue';
import Content from './components/Content.vue'
</script>
