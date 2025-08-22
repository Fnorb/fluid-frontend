<template>
  <div class="max-w-[1000px] w-full mx-auto px-4 text-white space-y-40 pt-60">

    <!-- sales pitch and photo -->
    <section>
      <ContentHeadline text="Arkadij Liebau - Frontend Craftsman" />
      <ContentTeaser class="section-bg" />
    </section>

    <!-- buttons and text transformer for skill description -->
    <section class="relative">
      <ContentHeadline text="Skills" />

      <div class="flex flex-col gap-3 sm:gap-4 ">
        <div class="flex flex-wrap gap-2">
          <SkillButton v-for="skill in skills" :key="skill.name" :skill-name="skill.name"
            :is-active="activeSkill === skill.name" @select="selectSkill(skill)"
            class="flex-grow flex justify-center" />
        </div>

        <div class="section-bg text-gray-300 pt-[20px] pb-[25px]">
          <TextTransformer :text="currentText" />
        </div>
      </div>
    </section>

    <!-- tech stack description -->
    <section>
      <ContentHeadline text="Tech Stack" />
      <ContentList :data="techData" class="section-bg" />
    </section>

    <!-- personal interests -->
    <section class="relative">
      <ContentHeadline text="Interessen" />
      <ul class="space-y-2 text-gray-300 section-bg">
        <li>📚 Sci-Fi &amp; Weird Fiction Literatur</li>
        <li>🍄 Pilze sammeln</li>
        <li>🎲 moderne Brett- und Pen &amp; Paper Rollenspiele</li>
        <li>🌿 Pflanzen & 🐱 Haustiere</li>
        <li>🔬 Naturwissenschaften</li>
      </ul>
    </section>

    <!-- link list -->
    <section class="mb-50">
      <ContentHeadline text="Links" />
      <ContentList :data="linkData" class="section-bg" />
    </section>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import TextTransformer from './TextTransformer.vue';
import SkillButton from './SkillButton.vue';
import ContentTeaser from './ContentTeaser.vue';
import ContentList from './ContentList.vue';
import ContentHeadline from './ContentHeadline.vue';

// data for skill and project description
const skills = [
  { name: 'Schwerpunkte', description: 'Frontend-Entwicklung - Vue.js - JavaScript - Animationen (CSS) - Moderne Layouts (Grid, Flexbox, responsive)', },
  { name: 'Gute Kenntnisse', description: 'E-Mail-Templates & responsives Design - Git & Code Reviews - GSAP - Salesforce / Veeva Administration - Wissensvermittlung & Ausbildertätigkeit - Adobe Photoshop / Animate - Drupal / CMS-Erweiterung - Jira - Confluence', },
  { name: 'Kürzlich erworben', description: 'React - TypeScript  - Figma - Flutter - Unity - Adobe Premiere Pro - Adobe After Effects - GraphQL- Tailwind', },
  { name: 'Grundkenntnisse', description: 'Laravel- Typo3 - MySQL - Pattern Lab - Drupal - Templating Engines - Test-Driven Development - Litmus - Bootstrap / Foundation - PHP - Babylon.js / Three.js - p5.js', },
  { name: 'Fokus-Projekte', description: 'Interaktive Präsentationen mit Veeva-/Salesforce-Integration - Electron-Apps & PWAs - Interne Tools.', },
];

// text transformer toggle
const currentText = ref(skills[0].description);
const activeSkill = ref<string | null>(skills[0].name);

const selectSkill = (skill: { name: string; description: string }) => {
  currentText.value = skill.description;
  activeSkill.value = skill.name;
};

// data for tech stack description
const techData = [
  { label: 'Vue 3 + TypeScript', value: 'Komponentenbasiertes Framework mit strenger Typisierung.' },
  { label: 'Vite', value: 'Schnelles Build- und Dev-Tool mit HMR.' },
  { label: 'Tailwind CSS', value: 'Utility-first Styling, ergänzt mit normalize.css.' },
  { label: 'GSAP', value: 'Performante Animationen und Interaktionen.' },
  { label: 'Testing & Quality', value: 'Vitest, Vue Test Utils, ESLint, BackstopJS für visuelle Regressionstests.' },
  { label: 'Deployment', value: 'GitHub Pages via CI/CD.' },
];

// data for link list
const linkData = [
  { label: 'GitHub', value: 'https://github.com/Fnorb/', href: 'https://github.com/Fnorb/' },
  { label: 'This Project', value: 'https://github.com/Fnorb/fluid-frontend/', href: 'https://github.com/Fnorb/fluid-frontend/' },
  { label: 'LinkedIn', value: 'https://www.linkedin.com/in/arkadij-liebau/', href: 'https://www.linkedin.com/in/arkadij-liebau/' },
  { label: 'Mail', value: 'aliebau79@gmail.com', href: 'mailto:aliebau79@gmail.com' },
  { label: 'Phone', value: '0151 26856489', href: 'tel:015126856489' },
  { label: 'Vita', value: 'https://drive.google.com/file/d/1ljxl4D8jBUmde0RDGLan96If71lt8SEQ/view?usp=sharing', href: 'https://drive.google.com/file/d/1ljxl4D8jBUmde0RDGLan96If71lt8SEQ/view?usp=sharing' },
];
</script>

<style scoped>
.section-bg {
  @apply bg-[#000a] p-[10px] rounded-[20px] relative backdrop-blur-[5px];
}
</style>