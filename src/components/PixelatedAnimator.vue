<template>
    <div ref="root" :style="filterStyle">
        <PixelatedImage class="relative" :width="250" :image="profilBild" :pixelation="pixelation" :animated="false" />
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import PixelatedImage from './PixelatedImage.vue'
import profilBild from '../assets/ProfilBild.jpg'

/**
 * All parameters are 0..1 (percent of viewport height)
 */
const props = withDefaults(defineProps<{
    yTop: number
    yBottom: number
    yDist: number
    minPixel: number
    maxPixel: number
    // Optional: filter values to blend
    saturateDefault?: number
    brightnessDefault?: number
    saturateFiltered?: number
    brightnessFiltered?: number
}>(), {
    yTop: 0.1,
    yBottom: 0.3,
    yDist: 0.2,
    minPixel: 0,
    maxPixel: 0.5,
    saturateDefault: 1,
    brightnessDefault: 1,
    saturateFiltered: 0,
    brightnessFiltered: 2,
})

const root = ref<HTMLElement | null>(null)

const pixelation = ref(props.minPixel)
const saturate = ref(props.saturateDefault)
const brightness = ref(props.brightnessDefault)

const filterStyle = computed(() => ({
    filter: `saturate(${saturate.value}) brightness(${brightness.value}) `,
    willChange: 'filter',
}))

function clamp01(x: number) { return Math.max(0, Math.min(1, x)) }
function lerp(a: number, b: number, t: number) { return a + (b - a) * t }

function updateFromViewport() {
    const canvas = root.value?.querySelector('canvas')
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const viewportH = window.innerHeight || document.documentElement.clientHeight
    const centerY = rect.top + rect.height / 2
    const norm = centerY / viewportH // 0 at top, 1 at bottom

    const { yTop, yBottom, yDist, minPixel, maxPixel } = props

    // Distance outside the target band, normalized by yDist
    let t = 0
    if (norm < yTop) {
        t = clamp01((yTop - norm) / yDist)
    } else if (norm > yBottom) {
        t = clamp01((norm - yBottom) / yDist)
    } else {
        t = 0 // inside the band
    }

    pixelation.value = lerp(minPixel, maxPixel, t)

    // Blend filters with the same t (inside band = defaults, far outside = filtered)
    saturate.value = lerp(props.saturateDefault, props.saturateFiltered, t)
    brightness.value = lerp(props.brightnessDefault, props.brightnessFiltered, t)
}

let ticking = false
function onScrollOrResize() {
    if (ticking) return
    ticking = true
    requestAnimationFrame(() => {
        updateFromViewport()
        ticking = false
    })
}

onMounted(async () => {
    await nextTick()           // ensure canvas exists
    updateFromViewport()       // initial position
    window.addEventListener('scroll', onScrollOrResize, { passive: true })
    window.addEventListener('resize', onScrollOrResize)
})

onUnmounted(() => {
    window.removeEventListener('scroll', onScrollOrResize)
    window.removeEventListener('resize', onScrollOrResize)
})
</script>
