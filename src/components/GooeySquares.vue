<template>
  <div style="filter: drop-shadow(0px 0px 61px #19e7c166) drop-shadow(0px 0px 12px #19e7c1ff)">
    <!--<div class="fixed inset-0 pointer-events-none" style="filter: drop-shadow(0px 0px 12px #19e7c1ff)">-->

    <!-- Normal Layer -->
    <div ref="normalLayer">
      <div v-for="(square, index) in squares" :key="'normal-' + index"
        class="square normal absolute w-20 h-20 bg-teal-300"
        :style="{ transform: `translate(${square.x}px, ${square.y}px) rotate(${square.rotation}deg)` }" />
    </div>

    <!-- Gooey Layer -->
    <div ref="gooeyLayer" style="filter: url(#gooey);">
      <div class="absolute top-0 left-0 w-[180px] h-16 bg-teal-300"></div>
      <div v-for="(square, index) in squares" :key="'gooey-' + index"
        class="square gooey absolute w-20 h-20 bg-teal-300"
        :style="{ transform: `translate(${square.x}px, ${square.y}px) rotate(${square.rotation}deg)` }" />
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
import { ref, onMounted, nextTick } from 'vue'
import { gsap } from 'gsap'

interface Square {
  x: number
  y: number
  rotation: number
  depthFactor: number
}

const squares = ref<Square[]>([])
const MAX_ROTATION_SPEED = 30 // deg per second

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
        rotation: Math.random() * 360,
        depthFactor: 0.5 + Math.random() * 0.5
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
  const SQUARE_COUNT = 20

  // Anfangsverteilung
  squares.value = generateSquares(SQUARE_COUNT, COLUMN_WIDTH, VIEWPORT_HEIGHT, MIN_DISTANCE)

  nextTick(() => {
    const normals = document.querySelectorAll('.square.normal')
    const gooeys = document.querySelectorAll('.square.gooey')

    squares.value.forEach((square, i) => {
      const elNormal = normals[i] as HTMLElement
      const elGooey = gooeys[i] as HTMLElement
      animateSquare(elNormal, elGooey, square.x, square.y, square.depthFactor)
    })
  })
})

function animateSquare(elNormal: HTMLElement, elGooey: HTMLElement, startX: number, startY: number, depthFactor: number) {
  const squareHeight = 40
  const endY = -squareHeight
  const distance = startY - endY
  const BASE_SPEED = 120 // px/s

  const speed = BASE_SPEED * depthFactor
  const duration = distance / speed

  const rotationSpeed = (Math.random() * 2 - 1) * MAX_ROTATION_SPEED
  const startRotation = Math.random() * 360
  const endRotation = startRotation + rotationSpeed * duration

  // RESET
  gsap.set(elNormal, {
    x: startX,
    y: startY,
    rotation: startRotation,
    scale: depthFactor,
    borderRadius: '0px'
  })

  gsap.set(elGooey, {
    x: startX,
    y: startY,
    rotation: startRotation,
    scale: 0.5 * depthFactor
  })

  // ANIMATION
  gsap.to(elNormal, {
    y: endY,
    rotation: endRotation,
    scale: 0.5 * depthFactor,
    borderRadius: '20px',
    duration,
    ease: 'none'
  })

  gsap.to(elGooey, {
    y: endY,
    rotation: endRotation,
    scale: depthFactor,
    duration,
    ease: 'none',
    onComplete: () => {
      const newX = Math.random() * 120
      const newY = window.innerHeight + squareHeight
      animateSquare(elNormal, elGooey, newX, newY, 0.5 + Math.random() * 0.5)
    }
  })
}
</script>
