# 📄 Web Pres Lieb - Fluid Frontend

### Author: Arkadij Liebau

## ✨ Overview

This repository contains a responsive onepager, that features an animated gooey-background as well as a text-transformation component (which briefly explains the appllied technologies). In addition there are unit tests, visual regression tests, and there is a deployment script.

## 🚀 Getting Started

Clone the repository and NPM install. Node v22 or higher is recommended.

### Prerequisites

- A web browser (e.g., Chrome, Firefox, Safari)
- Node.js and npm/yarn

### Scripts

- `npm run dev`: start the development server
- `npm run build`: builds the project for production
- `npm run preview`: serves the built project locally
- `npm run test`: runs unit tests
- `npm run type-check`: performs TypeScript type checking
- `npm run deploy-to-pages`: executes the deploy.cjs to push the compiled pager into the gh-pages worktree which his then published on GitHub Pages
- `npx backstop test`: visual regression test features

### Important URLs

- Repository: https://github.com/Fnorb/web-pres-lieb/
- GitHub Pages: https://fnorb.github.io/web-pres-lieb/

## 🛠️ Technologies & Libraries Used

This project leverages the following key technologies and libraries:

- **Vue 3 + TypeScript**: The core framework for building the user interface, utilizing the Composition API for modular and reactive components.
- **Tailwind CSS**: A utility-first CSS framework used for rapid and responsive styling, ensuring a consistent design across devices.
- **GSAP (GreenSock Animation Platform)**: A powerful JavaScript animation library used for creating the smooth, performance-friendly animations, including the gooey background effects and the character transformations in the `TextTransformer`.
  - Specifically, `MotionPathPlugin` is used for complex character movement.
- **CSS Houdini (Paint Worklet)**: A custom paint worklet (`squircle.min.js`) is employed to draw dynamic squirclets in the background, showcasing advanced CSS capabilities.
- **Vite**: A fast development build tool for Vue projects, providing quick hot module replacement (HMR) and optimized builds.
- **Vitest**: A blazing fast unit test framework powered by Vite, used for efficient component testing.
- **@vue/test-utils**: Vue.js testing utilities for mounting and interacting with Vue components in tests.
- **BackstopJS**: A visual regression testing framework to ensure UI consistency across changes.
- **Normalize.css**: A small CSS file that provides better cross-browser consistency in the default styling of HTML elements.
- **Autoprefixer & PostCSS**: Tools for processing CSS, automatically adding vendor prefixes and enabling modern CSS features.
- **TypeScript**: For type safety and improved code maintainability throughout the project.
- **Node.js**: The JavaScript runtime environment used for development scripts and deployment.

For a complete list of all dependencies and their exact versions, please refer to the [`package.json`](./package.json) file.

### Files

- Config Files: `backstop.json`, `package.json`, `postcss.config.js`, `tailwind.config.cjs`, `tsconfig.json`, `vite.config.mts`
- Main Files: `index.html`, `src/main.ts`, `src/App.vue`
- Styles: `src/style.css`
- Componentes:
  - `/src/components/Content.vue`: provides a button menu and a container for the TextTransformer
  - `/src/components/GooeySquares.vue`: provides an animated gooey background
  - `/src/components/Header.vue`: provides a responsive Header
  - `/src/components/TechButton.vue`: provides a button component for the content
  - `/src/components/TextTransformer.vue`: can be passed a string which is then transformed into other strings should a different value be passed
- Composables:
  - `/src/composables/useGooeySquares.ts`: provides logic for the GooeySquare component
- Worklets:
  - `public/paintWorklet/squircle.min.js`: provides squirclet functionality for Chromium browsers
- Utils:
  - `utils/debounce.ts`: holds a debouncer that prevents the excessive repeated calling of a function

### Folders

- `backstop_data`: visual regression test data
- `dist`: output
- `gh-pages`: worktree output to deploy to GitHub Pages
- `public/painWorklet`: Worklet for squirclet
- `src`: holds components and composables
- `utils`: holds small useful general purpose functionalities

### To Do

- Ensure a smooth transition if a new prop is passed to the TextTransformer before the last animation completed
