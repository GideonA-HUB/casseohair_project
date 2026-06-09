/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          pink: '#E62E72',
          black: '#000000',
          accent: '#1A1A1A',
          white: '#FFFFFF',
          gray: {
            50: '#F8F8F8',
            100: '#F3F3F3',
            200: '#E5E5E5',
          },
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Montserrat', 'Inter', 'sans-serif'],
      },
      borderRadius: {
        luxury: '20px',
        card: '16px',
      },
      boxShadow: {
        luxury: '0 4px 24px rgba(0, 0, 0, 0.06)',
        'luxury-lg': '0 8px 40px rgba(0, 0, 0, 0.08)',
        card: '0 2px 16px rgba(0, 0, 0, 0.05)',
      },
      animation: {
        'spin-slow': 'spin 2s linear infinite',
        'fade-in': 'fadeIn 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
