<!-- ContentTeaser.vue -->
<template>
    <section>
        <div class="flex flex-wrap justify-center lg:justify-between items-start gap-10 relative text-gray-300">
            <div class="flex-1 min-w-[20rem] text-base md:text-lg leading-relaxed">
                <ul class="list-disc pl-5 space-y-3">
                    <li v-for="item in items" :key="item">{{ item }}</li>
                </ul>
            </div>

            <div
                class="flex-grow-0 w-full lg:w-auto flex justify-center lg:justify-end drop-shadow-[0_0_7px_#15a8] h-75">
                <sliced-image :src="ProfilePhoto" :slices="[3, 10, 87]" :gap="5" class="flex" />
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import SlicedImage from './SlicedImage.vue';
import ProfilePhoto from '../assets/ProfilBild.jpg'

const items = [
    'Frontend-Entwickler mit über 16 Jahren Erfahrung.',
    'IHK-geprüfter Ausbilder.',
    'Experte für Vue.js, CSS und JavaScript.',
    'Kontinuierliche Weiterbildung: React, TypeScript, Figma, GraphQL, Flutter, Unity.',
    'Zertifiziert in React, Flutter und Unity (2025).',
    'Stärkenprofil: wissbegierig, strategisch, kreativ und lösungsorientiert.',
] as const
</script>