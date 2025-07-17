// tailwind.config.cjs
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      // Entfernen Sie den 'colors'-Block hier, wenn Sie ihn im CSS definieren
      // oder lassen Sie ihn leer, wenn Sie keine anderen Farb-Overrides haben.
    },
  },
  plugins: [],
};
