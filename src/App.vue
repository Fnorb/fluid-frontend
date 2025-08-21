<template>
  <div class="min-h-screen relative">

    <!-- slow scrolling background -->
    <ParallaxBackdrop :srcTall="parallaxBgTall" :srcStandard="parallaxBgStandard" :srcWide="parallaxBgWide"
      :strength="80" :invert="true" tint="rgba(9,70,100,0.2)" :edgeFade="true" />

    <div class="gooey-container fixed h-full" v-if="!reducedMotion">
      <GooeySquares />
    </div>
    <AppContent />
    <AppHeader />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import AppHeader from './components/AppHeader.vue';
import GooeySquares from './components/GooeySquares.vue';
import AppContent from './components/AppContent.vue';
import ParallaxBackdrop from './components/ParallaxBackdrop.vue';

// parallax backdrop image imports
import parallaxBgStandard from './assets/parallax-bg-standard.webp'
import parallaxBgTall from './assets/parallax-bg-tall.webp'
import parallaxBgWide from './assets/parallax-bg-wide.webp'

const reducedMotion = ref(false);

// do not render the gooey animation if reduced motion is requested
onMounted(() => {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  reducedMotion.value = mq.matches;

  mq.addEventListener("change", (e) => {
    reducedMotion.value = e.matches;
  });
});
</script>

<style>
/* reposition the gooey animation depending on the available space */
@media (min-width: 1100px) {
  .gooey-container {
    left: calc((100vw - 1000px) / 2 - 150px);
  }
}

@media (max-width: 768px) and (orientation: portrait) {
  .gooey-container {
    @apply left-1/2 -translate-x-1/2;
  }
}
</style>