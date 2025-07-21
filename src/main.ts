import { createApp } from "vue";
import App from "./App.vue";
import "./style.css"; // Tailwind CSS

if ("paintWorklet" in CSS) {
  (CSS as any).paintWorklet
    .addModule("/paintWorklet/squircle.min.js")
    .then(() => {
      console.log("Paint worklet loaded — squircles are live");
    });
}

createApp(App).mount("#app");
