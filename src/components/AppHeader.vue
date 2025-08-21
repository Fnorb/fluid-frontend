<template>
  <header class="fixed inset-x-0 top-0 bg-[linear-gradient(3deg,_var(--color-teal-300)_40%,_#ccfbf1)] min-h-16">
    <div class="relative max-w-screen-lg mx-auto min-h-16 px-4
             grid grid-cols-[1fr_auto_1fr] items-center
             md:grid-cols-[auto_1fr_auto]">

      <!-- headline -->
      <h1 class="font-semibold drop-shadow-[0_0_5px_rgba(200,255,255,0.3)] mix-blend-plus-lighter 
               text-base text-center col-start-2 justify-self-center
               sm:text-lg
               md:text-xl md:col-start-1 md:col-end-2 md:text-left md:justify-self-start">
        Fluid Frontend
      </h1>

      <!-- icons -->
      <nav class="hidden sm:flex col-start-3 justify-self-end items-center gap-3">
        <a v-for="icon in headerIcons" :key="icon.type" :href="icon.link" target="_blank" rel="noopener noreferrer"
          class="header-icon-btn" :aria-label="icon.type">
          <div v-html="icon.svg" class="w-7 h-7 text-black transition-colors duration-200
             hover:text-teal-800" />
        </a>
      </nav>

      <!-- burger menu with flyout -->
      <div class="sm:hidden col-start-3 justify-self-end relative">

        <!-- rotating burger icon -->
        <button class="header-icon-btn" :aria-expanded="isMenuOpen ? 'true' : 'false'" aria-controls="header-flyout"
          aria-label="Toggle menu" type="button" @click="isMenuOpen = !isMenuOpen">
          <span v-html="burgerSvg" :class="[
            'w-6 h-6 text-black transition-transform duration-200 ease-in-out origin-center transform-gpu will-change-transform',
            isMenuOpen ? 'rotate-90' : 'rotate-0',
            'motion-reduce:transform-none motion-reduce:transition-none'
          ]" />
        </button>

        <!-- flyout -->
        <transition enter-active-class="animate-flyout-drop" leave-active-class="animate-flyout-reverse">
          <div v-if="isMenuOpen" id="header-flyout" role="menu" aria-label="Header quick actions" class="absolute left-1/2 -translate-x-1/2 top-full mt-1
                    rounded-b-xl shadow-lg p-3 bg-teal-300 w-18 origin-top">
            <div class="flex flex-col gap-2">
              <a v-for="icon in headerIcons" :key="`flyout-${icon.type}`" :href="icon.link" target="_blank"
                rel="noopener noreferrer" class="flex items-center justify-center w-full h-12 rounded-full
       hover:bg-teal-600/20 active:scale-95 transition
       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600/40" role="menuitem">
                <div v-html="icon.svg" class="w-7 h-7 text-white"></div>
              </a>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </header>
</template>

<script lang="ts" setup>
import { computed, ref, onMounted, onBeforeUnmount } from 'vue';

// icons and menu toggle
const isMenuOpen = ref(false);
const iconModules = import.meta.glob('../assets/icons/*.svg', { eager: true, query: '?raw', import: 'default' });
const burgerSvg = iconModules['../assets/icons/burger.svg'] as string;

// react to esc press
const onEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') isMenuOpen.value = false; };
onMounted(() => document.addEventListener('keydown', onEsc));
onBeforeUnmount(() => document.removeEventListener('keydown', onEsc));

// link data
const links = ref([
  { type: 'github', file: 'github.svg', link: 'https://github.com/Fnorb/' },
  { type: 'linkedin', file: 'linkedin.svg', link: 'https://www.linkedin.com/in/arkadij-liebau/' },
  { type: 'mail', file: 'mail.svg', link: 'mailto:aliebau79@gmail.com' },
  { type: 'phone', file: 'phone.svg', link: 'tel:015126856489' },
  { type: 'cv', file: 'cv.svg', link: 'https://drive.google.com/file/d/1ljxl4D8jBUmde0RDGLan96If71lt8SEQ/view?usp=sharing' },
]);

const headerIcons = computed(() =>
  links.value.map(item => ({
    ...item,
    svg: iconModules[`../assets/icons/${item.file}`] as string,
  }))
);
</script>

<style scoped>
/* get utility classes working for apply directives */
@reference "tailwindcss";

/* header icons utility class */
.header-icon-btn {
  @apply grid place-items-center w-11 h-11 rounded-full transition hover:bg-teal-600/20 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600/40;
}

/* flyout animation */
@keyframes flyout-drop {
  0% {
    opacity: 0;
    transform: translateY(-8px) scale(0.98);
  }

  70% {
    opacity: 1;
    transform: translateY(4px) scale(1.0);
  }

  100% {
    opacity: 1;
    transform: translateY(0) scale(1.0);
  }
}

@keyframes flyout-reverse {
  0% {
    opacity: 1;
    transform: translateY(0) scale(1.0);
  }

  100% {
    opacity: 0;
    transform: translateY(-8px) scale(0.98);
  }
}

.animate-flyout-drop {
  animation: flyout-drop 240ms cubic-bezier(.2, .8, .2, 1);
  transform-origin: top;
}

.animate-flyout-reverse {
  animation: flyout-reverse 160ms cubic-bezier(.2, .8, .2, 1);
  transform-origin: top;
}

/* respect reduced motion */
@media (prefers-reduced-motion: reduce) {

  .animate-flyout-drop,
  .animate-flyout-reverse {
    animation: none !important;
  }
}
</style>
