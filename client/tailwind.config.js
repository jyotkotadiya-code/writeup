/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        light: {
          bg: '#F7F7F5',
          card: '#FFFFFF',
          text: '#111111',
          secondary: '#666666',
          border: '#E5E5E0',
        },
        dark: {
          bg: '#0B0B0D',
          card: '#16161A',
          text: '#F5F5F5',
          secondary: '#A1A1AA',
          border: '#27272A',
        },
        brand: {
          50: '#FBF7F0',
          100: '#F5ECE0',
          500: '#C25E00',
          600: '#B04B00',
          700: '#8A3B00',
        },
      },
      fontFamily: {
        serif: ['Lora', 'Merriweather', 'Georgia', 'serif'],
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
