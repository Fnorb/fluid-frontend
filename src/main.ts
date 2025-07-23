import { createApp } from "vue";
import App from "./App.vue";
import "./style.css"; // Tailwind CSS

if ("paintWorklet" in CSS) {
  (CSS as any).paintWorklet
    .addModule(`${import.meta.env.BASE_URL}paintWorklet/squircle.min.js`)
    .then(() => {
      console.log("Paint worklet loaded — squircles are live");
    });
}

createApp(App).mount("#app");
