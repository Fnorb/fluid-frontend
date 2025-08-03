<template>
  <div class="min-h-screen">
    <div class="gooey-container fixed top-0">
      <GooeySquares />
    </div>
    <AppContent />
    <AppHeader />
  </div>
</template>

<script setup lang="ts">
import AppHeader from './components/AppHeader.vue';
import GooeySquares from './components/GooeySquares.vue';
import AppContent from './components/AppContent.vue';
</script>

<style>
/* reposition the gooey animation depending on the available space */
@media only screen and (min-width: 1100px) {
  .gooey-container {
    left: calc((100vw - 1000px) / 2 - 150px);
  }
}

@media (max-width: 768px) and (orientation: portrait) {
  .gooey-container {
    left: 50%;
    transform: translateX(-50%);
  }
}
</style>