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
        spu: {
          purple: '#3B0764',
          darkPurple: '#2E0249',
          plum: '#4A154B',
          deep: '#1e0a29',
          magenta: '#BE185D',
          pink: '#DB2777',
          lightPink: '#FDF2F8',
          softPink: '#FCE7F3',
          borderPink: '#FBCFE8',
          accent: '#EC4899',
          lavender: '#F3E8FF'
        },
        brand: {
          50: '#fdf2f8',
          100: '#fce7f3',
          200: '#fbcfe8',
          300: '#f9a8d4',
          400: '#f472b6',
          500: '#ec4899',
          600: '#db2777',
          700: '#be185d',
          800: '#9d174d',
          900: '#831843',
          950: '#500724',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'Sarabun', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'spu': '0 10px 25px -3px rgba(74, 21, 75, 0.1), 0 4px 6px -2px rgba(74, 21, 75, 0.05)',
        'spu-lg': '0 20px 30px -8px rgba(74, 21, 75, 0.2)',
        'glow-pink': '0 0 20px rgba(219, 39, 119, 0.35)',
      }
    },
  },
  plugins: [],
}
