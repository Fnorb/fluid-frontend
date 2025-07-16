import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'  // richtiges Plugin

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),  // funktioniert gleich wie offizielles Tutorial :contentReference[oaicite:5]{index=5}
  ],
  test: {
    environment: 'jsdom',
  }
})
