<template>
  <div class="fixed inset-0 z-0 pointer-events-none">
    <div
      v-for="(square, index) in squares"
      :key="index"
      class="square absolute w-4 h-4 bg-green-300 rounded-sm"
      :style="{
        transform: `translate(${square.x}px, ${square.y}px) rotate(${square.rotation}deg)`
      }"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Square {
  x: number
  y: number
  rotation: number
}

const NUMBER_OF_CUBES = 10
const COLUMN_WIDTH = 100
const squares = ref<Square[]>([])

function generateSquares(count: number, areaWidth: number, areaHeight: number, minDistance: number, maxAttempts: number = 30): Square[] {
  const placed: Square[] = []

  for (let i = 0; i < count; i++) {
    let bestLocation: { x: number; y: number; dist: number } | null = null

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const candidateX = Math.random() * areaWidth
      const candidateY = Math.random() * areaHeight

      // Berechne Abstand zur nächsten bereits platzierten Square
      let minDist = Infinity

      for (const sq of placed) {
        const dist = Math.hypot(sq.x - candidateX, sq.y - candidateY)
        if (dist < minDist) minDist = dist
      }

      // beim ersten Versuch: setzen
      if (!bestLocation || minDist > bestLocation.dist) {
        bestLocation = { x: candidateX, y: candidateY, dist: minDist }
      }
    }

    if (bestLocation && bestLocation.dist >= minDistance) {
      placed.push({
        x: bestLocation.x,
        y: bestLocation.y,
        rotation: Math.random() * 360
      })
    } else {
      console.warn(`Skipping square ${i}: no good placement found after ${maxAttempts} attempts`)
    }
  }

  return placed
}

onMounted(() => {
  const COLUMN_WIDTH = 120
  const VIEWPORT_HEIGHT = window.innerHeight
  const MIN_DISTANCE = 20
  const SQUARE_COUNT = 15

  squares.value = generateSquares(SQUARE_COUNT, COLUMN_WIDTH, VIEWPORT_HEIGHT, MIN_DISTANCE)
})
</script>
