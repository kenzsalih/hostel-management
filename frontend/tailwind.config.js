/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      fontFamily: {
        heading: ['Sora', 'Segoe UI', 'sans-serif'],
        body: ['Space Grotesk', 'Segoe UI', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#fdf7ed',
          100: '#faebd3',
          200: '#f3d29f',
          300: '#ebbc73',
          400: '#e39f40',
          500: '#d88720',
          600: '#be6d15',
          700: '#9d5514',
          800: '#7f4517',
          900: '#683a16',
        },
      },
      boxShadow: {
        glow: '0 18px 45px rgba(17, 26, 46, 0.2)',
      },
      keyframes: {
        rise: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        rise: 'rise 450ms ease-out both',
      },
    },
  },
  plugins: [],
};
