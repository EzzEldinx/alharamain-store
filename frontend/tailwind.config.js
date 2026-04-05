/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          primary: "#FFFFFF",
          darkText: "#111111",
          luxuryRed: "#D92D20", // For SALE badges
          brandDark: "#1A1A1A", // For announcement bar
        },
        fontFamily: {
          sans: ['Inter', 'sans-serif'],
          serif: ['Playfair Display', 'serif'],
        }
      },
    },
    plugins: [],
  }