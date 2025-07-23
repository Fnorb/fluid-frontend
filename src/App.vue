<template>
  <div class="min-h-screen">
    <div class="gooey-container fixed top-0">
      <GooeySquares />
    </div>
    <Content />
    <Header />
  </div>
</template>

<script setup lang="ts">
import Header from './components/Header.vue'
import GooeySquares from './components/GooeySquares.vue';
import Content from './components/Content.vue'
</script>

<style>
@media only screen and (min-width: 1000px) {
  .gooey-container {
    left: calc((100vw - 1000px) / 2 - 150px);
    border: 2px solid red;
  }
}

@media only screen and (max-width: 1000px) {
  .gooey-container {
    left: 20px;
    border: 2px solid teal;
  }
}
</style>