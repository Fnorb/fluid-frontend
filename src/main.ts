import { createApp } from "vue";
import App from "./App.vue";
import "./style.css"; // Tailwind CSS

// use the paintWorklet if the browser supports it
if ("paintWorklet" in CSS) {
  (CSS as any).paintWorklet.addModule(
    `${import.meta.env.BASE_URL}paintWorklet/squircle.min.js`
  );
}

createApp(App).mount("#app");
