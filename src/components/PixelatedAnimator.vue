<template>
    <div :style="filterStyle">
        <PixelatedImage class="relative" :width="375" :image="redDesert" :pixelation="pixelation"
            :duration="animDuration" animated />
    </div>
</template>

<script setup lang="ts">
import PixelatedImage from './PixelatedImage.vue';
import redDesert from '../assets/red_desert.webp';
import { onMounted, onUnmounted, ref, computed } from 'vue';

const pixelation = ref(0);
const animDuration = 400;
const saturate = ref(1);
const contrast = ref(1);

let timeoutId: ReturnType<typeof setTimeout> | null = null;
let nextIsA = true;

const filterStyle = computed(() => ({
    filter: `saturate(${saturate.value}) brightness(${contrast.value})`,
    transition: `filter ${animDuration}ms ease`,
    willChange: 'filter',
}));

function scheduleNextTimer() {
    const delay = nextIsA
        ? 1000 + Math.random() * 2000
        : animDuration;

    timeoutId = setTimeout(() => {
        if (nextIsA) {
            pixelation.value = 0.2 + Math.random() * 0.4;
            saturate.value = 0;
            contrast.value = 1.5
        } else {
            pixelation.value = 0;
            saturate.value = 1;
            contrast.value = 1
        }

        nextIsA = !nextIsA;
        scheduleNextTimer();
    }, delay);
}

onMounted(() => {
    saturate.value = 1;
    scheduleNextTimer();
});

onUnmounted(() => {
    if (timeoutId) clearTimeout(timeoutId);
});
</script>
