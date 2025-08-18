<!-- ContentTeaser.vue -->
<template>
    <section>
        <div class="flex flex-wrap justify-center lg:justify-between items-start gap-10 relative text-gray-300">
            <div class="flex-1 min-w-[20rem] text-base md:text-lg leading-relaxed">
                <ul class="list-disc pl-5 space-y-3">
                    <li v-for="item in items" :key="item">{{ item }}</li>
                </ul>
            </div>

            <div class="flex-grow-0 w-full lg:w-auto flex justify-center lg:justify-end drop-shadow-xl">
                <img src="../assets/ProfilBild.jpg" class="max-w-[70%]! rounded-tr-xl rounded-br-xl">
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
const items = [
    'Frontend-Entwickler mit über 16 Jahren Erfahrung.',
    'IHK-geprüfter Ausbilder.',
    'Experte für Vue.js, CSS und JavaScript.',
    'Kontinuierliche Weiterbildung: React, TypeScript, Figma, GraphQL, Flutter, Unity.',
    'Zertifiziert in React, Flutter und Unity (2025).',
    'Stärkenprofil: wissbegierig, strategisch, kreativ und lösungsorientiert.',
] as const
</script>