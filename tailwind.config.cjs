// tailwind.config.cjs
const squircle = require("tailwindcss-squircle"); //

module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"], //
  theme: {
    squircle: {
      // optional: customize
      defaultRadius: 0.5, //
      defaultPadding: 0.25, //
    },
    // If you want to use your custom CSS variables with Tailwind's default theme,
    // you would extend here. For example:
    // extend: {
    //   fontFamily: {
    //     sans: 'var(--font-sans)',
    //     mono: 'var(--font-mono)',
    //   },
    //   fontSize: {
    //     lg: 'var(--text-lg)',
    //     xl: 'var(--text-xl)',
    //   },
    //   // etc. for colors, spacing, breakpoints if you want them as Tailwind classes
    // }
  },
  plugins: [squircle], //
};
