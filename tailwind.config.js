/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0284c7',
          600: '#0369a1',
          700: '#075985',
          800: '#0c4a6e',
          900: '#082f49',
          navy: '#0A2540',
          darkBlue: '#002D62',
          teal: '#00A896',
          cyan: '#028090',
          coral: '#FF6B35',
          amber: '#F77F00',
        },
        health: {
          green: '#10B981',
          emerald: '#059669',
          warning: '#F59E0B',
          danger: '#EF4444',
          purple: '#8B5CF6',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 2px 12px -2px rgba(0, 45, 98, 0.08), 0 4px 20px -2px rgba(0, 45, 98, 0.04)',
        'card-hover': '0 12px 28px -4px rgba(0, 45, 98, 0.12), 0 6px 12px -2px rgba(0, 45, 98, 0.06)',
        'nav': '0 4px 20px -2px rgba(10, 37, 64, 0.08)',
      }
    },
  },
  plugins: [],
}
