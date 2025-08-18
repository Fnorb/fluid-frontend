<template>
  <div class="w-[180px]">
    <!--<div class="bg-gradient-to-br from-bg-light from-0% via-bg-medium via-23% to-bg-dark to-100% bg-fixed bg-cover">
    </div>-->
    <div style="filter: drop-shadow(0px 0px 22px #19e7c1aa)">
      <div ref="normalLayer" class="normal-layer">
        <div v-for="(square, index) in squares" :key="'normal-' + index" :data-square-id="index"
          class="square normal absolute w-20 h-20 bg-teal-300"
          :style="{ transform: `translate(${square.x}px, ${square.y}px) rotate(${square.rotation}deg)` }" />
      </div>

      <div ref="gooeyLayer" class="gooey-layer" style="filter: url(#gooey);">
        <div class="absolute top-0 left-0 w-[180px] h-16 bg-teal-300"></div>
        <div v-for="(square, index) in squares" :key="'gooey-' + index" :data-square-id="index"
          class="square gooey absolute w-20 h-20 bg-teal-300"
          :style="{ transform: `translate(${square.x}px, ${square.y}px) rotate(${square.rotation}deg)` }" />
      </div>
    </div>
  </div>
  <svg class="absolute">
    <filter id="gooey">
      <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
      <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0
                               0 1 0 0 0
                               0 0 1 0 0
                               0 0 0 20 -10" result="gooey" />
      <feComposite in="SourceGraphic" in2="gooey" operator="atop" />
    </filter>
  </svg>
</template>

<script setup lang="ts">
import { onMounted, nextTick } from 'vue';
import { useGooeySquares } from '../composables/useGooeySquares';

// Define constants for configuration
const COLUMN_WIDTH = 120;
const MIN_DISTANCE = 20;
const SQUARE_COUNT = 20;

// Use the composable
const { squares, animateSquare } = useGooeySquares(COLUMN_WIDTH, SQUARE_COUNT, MIN_DISTANCE);

onMounted(() => {
  nextTick(() => {
    // Select elements after they are rendered in the DOM
    const normals = document.querySelectorAll('.square.normal');
    const gooeys = document.querySelectorAll('.square.gooey');

    squares.value.forEach((square, i) => {
      const elNormal = normals[i] as HTMLElement;
      const elGooey = gooeys[i] as HTMLElement;
      if (elNormal && elGooey) {
        animateSquare(elNormal, elGooey, square.x, square.y, square.depthFactor);
      }
    });
  });
});
</script>
