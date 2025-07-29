<template>
  <div class="max-w-[1000px] w-full mx-auto pt-32 px-4">
    <div class="grid-container grid
             grid-rows-auto
             gap-[13px]">
      <h2 class="[grid-area:header] text-3xl font-bold text-white mb-4 z-10">
        Tech Stack Overview
      </h2>
      <div class="button-container contents">
        <TechButton v-for="tech in techs" :key="tech.name" :tech-name="tech.name" :is-active="activeTech === tech.name"
          @select="selectTech(tech)" />
      </div>
      <div class="
          [grid-area:content]
          p-4
          bg-black/30
          bg-[rgba(255,255,255,0.05)]
          rounded-lg
          backdrop-blur-sm
        ">
        <TextTransformer :text="currentText" class="[grid-area:content] text-white" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import TextTransformer from './TextTransformer.vue';
import TechButton from './TechButton.vue';

const techs = [
  { name: 'Vue 3 + TS', description: 'Built with Vue 3 and TypeScript using the Composition API for clean, modular code.', },
  { name: 'GSAP', description: 'Performance-friendly animations for gooey shapes and character motion using GSA.', },
  { name: 'Tailwind', description: 'Utility-first styling with Tailwind makes layout fast, consistent, and responsive.', },
  { name: 'Houdini', description: 'A custom CSS Houdini paint worklet draws dynamic squirclets in the background.', },
  { name: 'Deploy', description: 'A Node script pushes the built app to a Git worktree for GitHub Pages hosting.', },
];

const currentText = ref(techs[0].description)
const activeTech = ref<string | null>(techs[0].name);

const selectTech = (tech: { name: string; description: string }) => {
  currentText.value = tech.description;
  activeTech.value = tech.name;
};
</script>

<style scoped>
.grid-container {
  grid-template-columns: auto 1fr;
  grid-template-areas:
    'header header'
    'buttons content'
    'buttons content'
    'buttons content'
    'buttons content'
    'buttons content';
}

@media (max-width: 768px) and (orientation: portrait) {
  .grid-container {
    grid-template-columns: 1fr;
    grid-template-areas:
      'header'
      'buttons'
      'content';
  }

  .button-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 10px;
  }

  button {
    flex-grow: 1;
  }
}
</style>