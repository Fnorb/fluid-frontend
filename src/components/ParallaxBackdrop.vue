<template>
    <div class="fixed inset-0 -z-10 overflow-hidden pointer-events-none bg-[var(--backdrop-base,#062b2b)]">
        <picture class="absolute inset-0 block w-full h-full">
            <!-- ultrawide first -->
            <source :srcset="srcWide" media="(min-aspect-ratio: 21/9)" />
            <!-- standard -->
            <source :srcset="srcStandard" media="(min-aspect-ratio: 16/9)" />
            <!-- tall (fallback for anything narrower) -->
            <img ref="imgEl" :src="srcTall" alt="" aria-hidden="true"
                class="absolute inset-0 w-full h-full object-cover will-change-transform"
                :style="{ transform: `translateY(${offset}px)`, opacity }" decoding="async" />
        </picture>

        <div v-if="tint" class="absolute inset-0 pointer-events-none" :style="{ background: tint }"></div>

        <div v-if="edgeFade" class="absolute inset-0 pointer-events-none" :style="{
            WebkitMaskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
            maskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)'
        }" />
    </div>
</template>


<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'

type Props = {
    /** Tall portrait-ish crop (e.g. 1080x2160) */
    srcTall: string
    /** Standard crop (e.g. 2560x1440) */
    srcStandard: string
    /** Ultrawide crop (e.g. 3840x1600) */
    srcWide: string
    /** Parallax strength in px from center (default 60) */
    strength?: number
    /** Invert scroll direction */
    invert?: boolean
    /** Opacity 0..1 */
    opacity?: number
    /** CSS color for tint overlay */
    tint?: string
    /** Show side edge fades */
    edgeFade?: boolean
}
const props = withDefaults(defineProps<Props>(), {
    strength: 60,
    invert: false,
    opacity: 0.7,
    tint: '',
    edgeFade: false
})

const imgEl = ref<HTMLImageElement | null>(null)
const offset = ref(0)

// Choose the right crop by aspect ratio using <img sizes + srcset>
// We’ll let the browser pick with media conditions:
const srcsetComputed = computed(() => {
    return `${props.srcWide} 3840w, ${props.srcStandard} 1600w, ${props.srcTall} 1080w`;
});

// Hint the browser which set to use by viewport aspect:
const sizes = `(min-aspect-ratio: 21/9) 100vw,
               (min-aspect-ratio: 16/9) 100vw,
               100vw`

// Reasonable fallback (standard)
const fallback = computed(() => props.srcStandard)

let ticking = false
const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)') ?? { matches: false }

function update() {
    console.log("update")
    ticking = false
    if (reduceMotion.matches) { offset.value = 0; return }
    const doc = document.documentElement
    const maxScroll = Math.max(1, doc.scrollHeight - window.innerHeight)
    const progress = window.scrollY / maxScroll // 0..1
    const dir = props.invert ? -1 : 1
    // Centered motion around 0 → +/- strength
    offset.value = (progress + 0.5) * 2 * props.strength * dir
}
function onScroll() {
    if (!ticking) { ticking = true; requestAnimationFrame(update) }
}
const onResize = update

onMounted(() => {
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize, { passive: true })
})
onBeforeUnmount(() => {
    window.removeEventListener('scroll', onScroll)
    window.removeEventListener('resize', onResize)
})
</script>