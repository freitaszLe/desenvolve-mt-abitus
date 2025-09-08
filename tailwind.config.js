/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {

        'dark-bg': '#0A0A0A',
        'dark-card': '#1C1C1C',
        'dark-border': '#2F2F2F',
        'neon-red': '#E50000',
        'neon-red-dark': '#B20000',
        'neon-green': '#00CC00',
        'text-light': '#E0E0E0',
        'text-muted': '#A0A0A0',
        'gray-cyber': '#222222',
      },

      keyframes: {
        'pulse-slow': {
          '0%, 100%': { opacity: '0.2' },
          '50%': { opacity: '0.4' },
        }
      }, 
      animation: {
        'pulse-slow': 'pulse-slow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}