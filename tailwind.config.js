/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#eff8ff',
          100: '#daeffe',
          200: '#bce2fe',
          300: '#8ecffe',
          400: '#59affd',
          500: '#3a8df9',
          600: '#226ff0',
          700: '#1a5bd9',
          800: '#1c4bae',
          900: '#1d4189',
          950: '#162a52',
        },
        ink: {
          50: '#f6f8fb',
          100: '#eef2f8',
          200: '#dde6f2',
          300: '#c2d2e8',
          400: '#9fb3d4',
          500: '#7a93c0',
          600: '#5d75a8',
          700: '#4c5d89',
          800: '#3f4d70',
          900: '#36405e',
          950: '#232a41',
        },
      },
      boxShadow: {
        card: '0 1px 3px rgba(34, 111, 240, 0.06), 0 1px 2px rgba(34, 111, 240, 0.04)',
        'card-hover': '0 8px 24px rgba(34, 111, 240, 0.10), 0 2px 6px rgba(34, 111, 240, 0.06)',
        soft: '0 2px 8px rgba(35, 42, 65, 0.06)',
      },
      borderRadius: {
        xl: '0.875rem',
        '2xl': '1.25rem',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in': {
          '0%': { opacity: '0', transform: 'translateX(-12px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'draw-bar': {
          '0%': { transform: 'scaleY(0)' },
          '100%': { transform: 'scaleY(1)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.4s ease-out',
        'slide-in': 'slide-in 0.3s ease-out',
        'scale-in': 'scale-in 0.25s ease-out',
        'draw-bar': 'draw-bar 0.6s ease-out forwards',
      },
    },
  },
  plugins: [],
};
