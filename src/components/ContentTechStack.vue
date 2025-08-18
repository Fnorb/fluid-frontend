<template>
    <section ref="parallaxEl" class="relative overflow-hidden rounded-xl min-h-[400px] flex flex-col justify-center">
        <!-- background -->
        <div class="absolute inset-0 bg-cover bg-center will-change-transform opacity-70" :style="{
            backgroundImage: `url(${bgUrl})`,
            backgroundPosition: `center ${bgOffset}%`
        }"></div>

        <!-- content -->
        <div class="relative p-6">
            <h2 class="text-3xl font-bold mb-6">Tech Stack dieser Seite</h2>

            <!-- description list -->
            <dl class="grid gap-x-6 gap-y-3
                 [grid-template-columns:1fr]
                 md:[grid-template-columns:max-content_minmax(0,1fr)]">
                <template v-for="tech in techs" :key="tech.name">
                    <dt class="text-gray-300 font-medium text-left">
                        {{ tech.name }}
                    </dt>
                    <dd class="text-gray-100">
                        {{ tech.description }}
                    </dd>
                </template>
            </dl>
        </div>
    </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import bgImage from '../assets/techstack-bg2.webp'

const parallaxEl = ref<HTMLElement | null>(null)
const bgUrl = bgImage
const bgOffset = ref(50) // start centered

const techs = [
    { name: 'Vue 3 + TypeScript', description: 'Komponentenbasiertes Framework mit strenger Typisierung.' },
    { name: 'Vite', description: 'Schnelles Build- und Dev-Tool mit HMR.' },
    { name: 'Tailwind CSS', description: 'Utility-first Styling, ergänzt mit normalize.css.' },
    { name: 'GSAP', description: 'Performante Animationen und Interaktionen.' },
    { name: 'Testing & Qualität', description: 'Vitest, Vue Test Utils, ESLint, BackstopJS für visuelle Regressionstests.' },
    { name: 'Deployment', description: 'GitHub Pages via CI/CD.' }
]


const handleScroll = () => {
    if (!parallaxEl.value) return
    const rect = parallaxEl.value.getBoundingClientRect()
    const windowHeight = window.innerHeight

    const progress = (rect.top + rect.height / 2 - windowHeight / 2) / (windowHeight / 2)
    const min = 30
    const max = 70
    const value = 50 + progress * 20
    bgOffset.value = Math.max(min, Math.min(max, value))
}

onMounted(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
})
onBeforeUnmount(() => {
    window.removeEventListener('scroll', handleScroll)
})
</script>
