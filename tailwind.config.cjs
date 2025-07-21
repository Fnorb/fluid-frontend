module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
};

const squircle = require("tailwindcss-squircle");

module.exports = {
  theme: {
    squircle: {
      // optional: customize
      defaultRadius: 0.5,
      defaultPadding: 0.25,
    },
  },
  plugins: [squircle],
};
