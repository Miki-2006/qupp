/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f2f9ff",
          100: "#d9efff",
          200: "#b9e0ff",
          300: "#87c8f5",
          400: "#5fb2ea",
          500: "#4f9bdf",
          600: "#4f84df",
          700: "#5f6fe8",
          800: "#5756d0",
          900: "#394287",
        },
        accent: {
          400: "#5ad2e8",
          500: "#4cc4e4",
          600: "#34afd8",
        },
      },
    },
  },
  plugins: [],
}

