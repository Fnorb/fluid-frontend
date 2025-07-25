<template>
  <div class="max-w-[1000px] w-full mx-auto mt-32 px-4">
    <div class="grid-container grid
             grid-rows-auto
             gap-[13px]">
      <h2 class="[grid-area:header] text-3xl font-bold text-white mb-4 z-10">
        Discover Technologies
      </h2>
      <div class="button-container contents">
        <button v-for="tech in techs" :key="tech.name" class="buttons button-fallback relative px-6 py-3 text-white font-semibold
         bg-black/30
         bg-[rgba(255,255,255,0.03)]
         backdrop-blur-md border border-none
         [--squircle-radius:16]
         [--squircle-smooth:1.6]
         [mask-image:paint(squircle)]
         [mask-repeat:no-repeat]
         [mask-size:100%_100%]
         overflow-hidden cursor-pointer group transition-all duration-300 ease-in-out
         justify-self-stretch filter
         bg-[linear-gradient(to_right,rgba(0,128,128,0.2)_0%,rgba(0,128,128,0.0)_30%)]"
          :class="{ 'brightness-150': activeTech === tech.name }" @click="selectTech(tech)">
          <span
            class="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.2),rgba(255,255,255,0.1))] opacity-0 group-hover:opacity-30 transition-opacity duration-300 ease-in-out pointer-events-none"></span>

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
    name: 'Vue 3',
    description:
      'Vue 3 is a progressive JavaScript framework used to build user interfaces efficiently with a composition API.',
  },
  {
    name: 'GSAP',
    description:
      'GSAP is a high-performance animation library that enables smooth transitions, tweens, and motion paths in this project.',
  },
  {
    name: 'Tailwind',
    description:
      'Tailwind CSS provides utility-first styling that makes rapid UI development flexible and consistent.',
  },
  {
    name: 'ResizeObserver',
    description:
      'ResizeObserver is used to detect changes in element dimensions, ensuring character positions update on layout changes.',
  },
  {
    name: 'MotionPath',
    description:
      'The MotionPathPlugin from GSAP allows characters to animate along bezier paths, creating fluid curved animations.',
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