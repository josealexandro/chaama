/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#22c55e', // verde
          dark: '#16a34a',
          light: '#4ade80',
        },
        secondary: {
          DEFAULT: '#fbbf24', // amarelo para estrelas
        },
      },
    },
  },
  plugins: [],
}

