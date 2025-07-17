<template>
    <div class="z-0 pointer-events-none inset-0 absolute"></div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

interface Cube {
    x: number
    y: number
    rotation: number
}

const NUMBER_OF_CUBES = 5
const cubes = ref<Cube[]>([])
</script>