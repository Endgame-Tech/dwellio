/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class", // Enable dark mode via class strategy
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter"', "sans-serif"],
        inter: ['"Inter"', "sans-serif"],
        display: ['"Outfit"', "sans-serif"],
      },
      colors: {
        dwellio: {
          primary: "#ccf080",
          "primary-dark": "#aad55c",
          dark: "#27272a",
          light: "#f4fff7",
          50: "#f4fff7",
          100: "#e8ffe0",
          200: "#d5ffc0",
          300: "#ccf080",
          400: "#c4ed70",
          500: "#ccf080",
          600: "#aad55c",
          700: "#8bb847",
          800: "#6d9238",
          900: "#4a5f27",
        },
      },
      backgroundImage: {
        "gradient-dwellio": "linear-gradient(135deg, #ccf080 0%, #aad55c 100%)",
        "gradient-dwellio-to-br":
          "linear-gradient(to bottom right, #ccf080, #aad55c)",
      },
      boxShadow: {
        subtle: "0 2px 10px rgba(0, 0, 0, 0.05)",
        elevated:
          "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)",
      },
      borderRadius: {
        xl: "0.75rem",
        "2xl": "1rem",
      },
    },
  },
  plugins: [],
};
