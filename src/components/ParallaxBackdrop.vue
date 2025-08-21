<template>
    <div class="fixed inset-0 -z-10 overflow-hidden pointer-events-none bg-[var(--backdrop-base,#062b2b)]">

        <!-- background for different aspect ratios -->
        <picture class="absolute inset-0 block w-full h-full">

            <!-- ultrawide first -->
            <source :srcset="srcWide" media="(min-aspect-ratio: 21/9)" />

            <!-- standard -->
            <source :srcset="srcStandard" media="(min-aspect-ratio: 16/9)" />

            <!-- tall (fallback for anything narrower) -->
            <img ref="imgEl" :src="srcTall" alt="" aria-hidden="true"
                class="absolute inset-0 w-full h-full object-cover will-change-transform"
                :style="{ transform: `translateY(${offset}px)` }" decoding="async" />
        </picture>

        <!-- tint the background -->
        <div v-if="tint" class="absolute inset-0 pointer-events-none" :style="{ background: tint }"></div>
    </div>
</template>


<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'

type Props = {

    srcTall: string // background image for narrow aspect ratios
    srcStandard: string // background image for regular aspect ratios
    srcWide: string // background image for wide aspect ratios
    strength?: number // parallax strength
    invert?: boolean // invert scroll direction
    tint?: string // color definition for tint
}

const props = withDefaults(defineProps<Props>(), {
    strength: 60,
    invert: false,
    tint: '',
})

const imgEl = ref<HTMLImageElement | null>(null)
const offset = ref(0)

// picking the image matching the aspect ratio the best
const srcsetComputed = computed(() => {
    return `${props.srcWide} 3840w, ${props.srcStandard} 1600w, ${props.srcTall} 1080w`;
});

const sizes = `(min-aspect-ratio: 21/9) 100vw,
               (min-aspect-ratio: 16/9) 100vw,
               100vw`

// standard fallback
const fallback = computed(() => props.srcStandard)

let ticking = false
const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)') ?? { matches: false }

// set the correct image and scroll position on mount, scroll and resize
function update() {
    ticking = false
    if (reduceMotion.matches) { offset.value = 0; return }
    const doc = document.documentElement
    const maxScroll = Math.max(1, doc.scrollHeight - window.innerHeight)
    const progress = window.scrollY / maxScroll // 0..1
    const dir = props.invert ? -1 : 1
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

// clean up listeners on unmount
onBeforeUnmount(() => {
    window.removeEventListener('scroll', onScroll)
    window.removeEventListener('resize', onResize)
})
</script>