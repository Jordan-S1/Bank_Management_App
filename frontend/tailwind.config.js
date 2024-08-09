/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      transitionProperty: {
        width: "width",
      },
      fontFamily: {
        sans: ["Roboto", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "home-bg": "url('/gold_home_bg.jpg')", // Path relative to the public directory
      },
    },
  },
  plugins: [],
  darkMode: "selector", // Enable dark mode via a selector
};
