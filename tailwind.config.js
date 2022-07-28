/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: "#7650e5",
        accent1: "#fed893",
        accent2: "#f7b8ff"
      }
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
