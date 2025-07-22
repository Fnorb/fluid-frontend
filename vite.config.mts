import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  // Add this 'base' property for GitHub Pages deployment
  // Replace 'web-pres-lieb' with your actual repository name if it changes
  base: "/web-pres-lieb/", // <--- ADD THIS LINE

  plugins: [vue(), tailwindcss()],
  test: {
    environment: "jsdom",
  },
});
