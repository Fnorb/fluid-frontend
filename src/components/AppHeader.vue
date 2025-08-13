<template>
  <header
    class="fixed top-0 left-0 w-full bg-[linear-gradient(3deg,_var(--color-teal-300)_40%,_#ccfbf1)] h-fit min-h-16 z-30">
    <div class="max-w-screen-lg mx-auto flex items-center px-4 min-h-16">
      <h1 class="font-semibold text-white drop-shadow-[0_0_5px_rgba(200,255,255,0.3)] mix-blend-plus-lighter opacity-100
                 text-base text-center w-full 
                 sm:text-lg 
                 md:text-xl md:text-left md:w-auto">
        Fluid Frontend
      </h1>
      <div class="flex-grow"></div>
      <nav class="flex space-x-4">
        <a v-for="icon in headerIcons" :key="icon.type" :href="icon.link" target="_blank" rel="noopener noreferrer">
          <div v-html="icon.svg" class="w-6 h-6 text-white"></div>
        </a>
      </nav>
    </div>
  </header>
</template>


<script lang="ts" setup>
import { computed, ref } from 'vue';

const iconModules = import.meta.glob('../assets/icons/*.svg', { eager: true, query: '?raw', import: 'default' });

const links = ref([
  { type: 'github', file: 'github.svg', link: '' },
  { type: 'linkedin', file: 'linkedin.svg', link: '' },
  { type: 'mail', file: 'mail.svg', link: 'mailto:' },
  { type: 'phone', file: 'phone.svg', link: 'tel:' },
  { type: 'cv', file: 'cv.svg', link: '/.pdf' }
]);

const headerIcons = computed(() => {
  return links.value.map(item => {
    const filePath = `../assets/icons/${item.file}`;
    const svgContent = iconModules[filePath];
    return {
      ...item,
      svg: svgContent
    };
  });
});
</script>