<template>
  <div class="max-w-[1000px] w-full mx-auto mt-32 px-4">
    <div class="grid
             grid-rows-auto
             grid-cols-[auto_1fr]
             gap-[13px]
             grid-flow-row"
      style="grid-template-areas: 'header header' '. content' '. content' '. content' '. content' '. content'">
      <h2 class="[grid-area:header] text-3xl font-bold text-white mb-4">
        Discover Technologies
      </h2>

      <button v-for="tech in techs" :key="tech.name" class="button-fallback relative px-6 py-3 text-white font-semibold
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

      <div class="
          grid-column-start-2
          grid-column-end-3
          grid-row-start-2
          grid-row-end-[-1]
          col-start-2
          row-start-2 
          row-span-full 
          ml-4 
          p-4 
          bg-[rgba(255,255,255,0.05)]
          rounded-lg
          backdrop-blur-sm
        ">
        <TextTransformer :text="currentText" class="[grid-area:content] text-teal-300" />
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

// Initialize currentText with the description of the first tech
const currentText = ref(techs[0].description) // Directly set to the first tech's description
const activeTech = ref<string | null>(techs[0].name); // Directly set the first tech as active

const selectTech = (tech: { name: string; description: string }) => {
  currentText.value = tech.description;
  activeTech.value = tech.name;
};

// No need for onMounted logic here, as initial state is set directly
// onMounted(() => {
//   if (techs.length > 0) {
//     selectTech(techs[0])
//   }
// });
</script>

<style scoped>
@supports not (mask-image: paint(squircle)) {
  .button-fallback {
    border-radius: 16px;
  }
}
</style>