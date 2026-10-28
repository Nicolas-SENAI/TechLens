/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#2563EB',
          'blue-hover': '#1D4ED8',
          'blue-light': '#EFF6FF',
          purple: '#7C3AED',
          'purple-dark': '#6D28D9',
          'purple-light': '#F5F3FF',
          green: '#10B981',
          'green-dark': '#059669',
          'green-light': '#ECFDF5',
          bg: '#FAFAFC',
          'bg-soft': '#FAF8FF',
          surface: '#FFFFFF',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '8px',
        'sm': '6px',
        'md': '8px',
        'lg': '10px',
        'xl': '12px',
        '2xl': '16px',
      },
      boxShadow: {
        'soft': '0 2px 10px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.06)',
        'elevated': '0 8px 24px rgba(37, 99, 235, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04)',
        'purple-glow': '0 0 20px rgba(124, 58, 237, 0.25)',
      }
    },
  },
  plugins: [],
}
