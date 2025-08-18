<template>
  <div class="min-h-screen">
    <ParallaxBackdrop srcTall="src/assets/techstack-bg2.webp" srcStandard="src/assets/techstack-bg2.webp"
      srcWide="src/assets/techstack-bg2.webp" srcTall2x="src/assets/techstack-bg2.webp"
      srcStandard2x="src/assets/techstack-bg2.webp" srcWide2x="src/assets/techstack-bg2.webp" :strength="80"
      :invert="true" :opacity="1" tint="rgba(9,70,100,0.2)" :edgeFade="true" />
    <div class="gooey-container fixed h-full">
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
import ParallaxBackdrop from './components/ParallaxBackdrop.vue';
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