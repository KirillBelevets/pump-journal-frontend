/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2DD4BF", // teal-400
        accent: "#FBBF24", // yellow-400
        surface: "#F9FAFB", // gray-50
      },
      fontFamily: {
        brand: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
