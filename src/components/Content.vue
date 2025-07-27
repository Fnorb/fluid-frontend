<template>
  <div class="max-w-[1000px] w-full mx-auto pt-32 px-4">
    <div class="grid-container grid
             grid-rows-auto
             gap-[13px]">
      <h2 class="[grid-area:header] text-3xl font-bold text-white mb-4 z-10">
        Tech Stack Overview
      </h2>
      <div class="button-container contents">
        <button v-for="tech in techs" :key="tech.name" class="buttons button-fallback relative px-6 py-3 text-teal-200 font-semibold
         bg-[rgba(255,255,255,0.03)]
         backdrop-blur-md border border-none
         [--squircle-radius:16]
         [--squircle-smooth:1.6]
         [mask-image:paint(squircle)]
         [mask-repeat:no-repeat]
         [mask-size:100%_100%]
         overflow-hidden cursor-pointer group transition-all duration-300 ease-in-out
         justify-self-stretch filter
         bg-[linear-gradient(to_right,rgba(0,128,128,0.2)_0%,rgba(0,128,128,0.0)_30%)]" :class="{
          'brightness-150': activeTech === tech.name,
          'bg-black/30': activeTech !== tech.name
        }" @click="selectTech(tech)">
          <span
            class="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0),rgba(255,255,255,0))] opacity-0 group-hover:opacity-50 transition-opacity duration-300 ease-in-out pointer-events-none"></span>

          <span class="relative z-10">{{ tech.name }}</span>
        </button>
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
import { ref, onMounted } from 'vue';
import TextTransformer from './TextTransformer.vue';

const techs = [
  {
    name: 'Vue 3 + TS',
    description:
      'Built with Vue 3 and TypeScript using the Composition API for clean, modular code.',
  },
  {
    name: 'GSAP',
    description:
      'Performance-friendly animations for gooey shapes and character motion using GSAP.',
  },
  {
    name: 'Tailwind',
    description:
      'Utility-first styling with Tailwind makes layout fast, consistent, and responsive.',
  },
  {
    name: 'Houdini',
    description:
      'A custom CSS Houdini paint worklet draws dynamic squirclets in the background.',
  },
  {
    name: 'Deploy',
    description:
      'A Node script pushes the built app to a Git worktree for GitHub Pages hosting.',
  },
];

const currentText = ref(techs[0].description)
const activeTech = ref<string | null>(techs[0].name);

const selectTech = (tech: { name: string; description: string }) => {
  currentText.value = tech.description;
  activeTech.value = tech.name;
};
</script>

<style scoped>
@supports not (mask-image: paint(squircle)) {
  .button-fallback {
    border-radius: 16px;
  }
}

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