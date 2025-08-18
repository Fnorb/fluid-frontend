<template>
  <div class="max-w-[1000px] w-full mx-auto px-4 text-white space-y-40 pt-60">

    <!-- container for headline, keywords, pixelated photo -->
    <section>
      <h1 class="text-3xl font-bold text-white relative mb-5 text-white drop-shadow-[0_0_5px_rgba(200,255,255,0.6)] mix-blend-plus-lighter      
      ">Arkadij Liebau - Frontend Craftsman</h1>
      <ContentTeaser class="bg-[#000a] p-[10px] rounded-[20px] relative backdrop-blur-[5px]" />
    </section>

    <!-- container for the buttons and text content -->
    <section class="relative">
      <h1
        class="text-3xl font-bold text-white relative mb-5 text-white drop-shadow-[0_0_5px_rgba(200,255,255,0.6)] mix-blend-plus-lighter">
        Skills</h1>

      <!-- stacked layout: buttons row, then content -->
      <div class="flex flex-col gap-3 sm:gap-4 bg-[#000a] p-[10px] rounded-[20px] relative backdrop-blur-[5px]">
        <!-- buttons -->
        <div class="flex flex-wrap justify-center sm:justify-start gap-2 sm:gap-3">
          <!-- If TechButton forwards class to its root element, use this: -->
          <SkillButton v-for="skill in skills" :key="skill.name" :skill-name="skill.name"
            :is-active="activeSkill === skill.name" @select="selectSkill(skill)" class="flex-1 sm:flex-initial" />
          <!-- If it doesn't forward class, wrap it instead:
        <div v-for="tech in techs" :key="tech.name" class="flex-1 sm:flex-none">
          <TechButton ... />
        </div>
        -->
        </div>

        <!-- content -->
        <div class="bg-[#000a] p-[10px] rounded-[20px] relative backdrop-blur-[5px]">
          <TextTransformer :text="currentText" class="text-white" />
        </div>
      </div>
    </section>

    <section>
      <h1
        class="text-3xl font-bold text-white relative mb-5 text-white drop-shadow-[0_0_5px_rgba(200,255,255,0.6)] mix-blend-plus-lighter">
        Tech Stack dieser Seite</h1>
      <div class="relative p-6 bg-[#000a] p-[10px] rounded-[20px] relative backdrop-blur-[5px]">
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

    <section class="relative">
      <h1
        class="text-3xl font-bold text-white relative mb-5 text-white drop-shadow-[0_0_5px_rgba(200,255,255,0.6)] mix-blend-plus-lighter">
        Interessen</h1>
      <ul class="space-y-2 text-gray-300 bg-[#000a] p-[10px] rounded-[20px] relative backdrop-blur-[5px]">
        <li>📚 Sci-Fi &amp; Weird Fiction Literatur</li>
        <li>🍄 Pilze sammeln</li>
        <li>🎲 moderne Brett- und Pen &amp; Paper Rollenspiele</li>
        <li>🌿 Pflanzen & 🐱 Haustiere</li>
        <li>🔬 Naturwissenschaften</li>
      </ul>
    </section>

    <section class="mb-100">
      <h1
        class="text-3xl font-bold text-white relative mb-5 text-white drop-shadow-[0_0_5px_rgba(200,255,255,0.6)] mix-blend-plus-lighter">
        Links</h1>
      <ContentLinks class="bg-[#000a] p-[10px] rounded-[20px] relative backdrop-blur-[5px]" />
    </section>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import TextTransformer from './TextTransformer.vue';
import SkillButton from './SkillButton.vue';
import ContentTeaser from './ContentTeaser.vue';
import ContentLinks from './ContentLinks.vue';
import ContentTechStack from './ContentTechStack.vue';


const techs = [
  { name: 'Vue 3 + TypeScript', description: 'Komponentenbasiertes Framework mit strenger Typisierung.' },
  { name: 'Vite', description: 'Schnelles Build- und Dev-Tool mit HMR.' },
  { name: 'Tailwind CSS', description: 'Utility-first Styling, ergänzt mit normalize.css.' },
  { name: 'GSAP', description: 'Performante Animationen und Interaktionen.' },
  { name: 'Testing & Qualität', description: 'Vitest, Vue Test Utils, ESLint, BackstopJS für visuelle Regressionstests.' },
  { name: 'Deployment', description: 'GitHub Pages via CI/CD.' }
]


// button labels and the content that is displayed when the matching button is pressed
const skills = [
  { name: 'Schwerpunkte', description: 'Vue.js - CSS & moderne Layout-Techniken - JavaScript (ES6+) - Canvas-Animationen - UX-nahe Frontend-Entwicklung', },
  { name: 'Gute Kenntnisse', description: 'React - GSAP (Animationen) - Git & Code Reviews - Salesforce / Veeva Administration - E-Mail-Templates & responsives Design - Wissensvermittlung & Ausbildertätigkeit - Adobe Photoshop / Animate - Drupal / CMS-Erweiterung - Jira - Confluence', },
  { name: 'Kürzlich erworben', description: 'React - TypeScript  - Figma - Flutter - Unity - Adobe Premiere Pro - Adobe After Effects - GraphQL- Tailwind - CSS', },
  { name: 'Grundkenntnisse', description: 'Laravel- Typo3 - MySQL - Pattern Lab - Templating Engines (Twig, Handlebars, Mustache …) - Test-Driven Development (TDD) - Litmus (E-Mail Testing) - Bootstrap / Foundation - PHP - Babylon.js / Three.js - p5.js', },
  { name: 'Fokus-Projekte', description: 'Präsentationen für Pharmaunternehmen mit Vue, CSS und JavaScript, oft mit Veeva- oder Salesforce-Integration; dazu einzelne Electron-Apps, PWAs und interne Tools, begleitet durch Jira, Confluence und BCS im Projektalltag.', },
];

const currentText = ref(skills[0].description);
const activeSkill = ref<string | null>(skills[0].name);

const selectSkill = (skill: { name: string; description: string }) => {
  currentText.value = skill.description;
  activeSkill.value = skill.name;
};
</script>