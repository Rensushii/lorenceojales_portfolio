/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          deep: '#030711',
          surface: '#060b18',
        },
        accent: {
          cyan: '#06b6d4',
          blue: '#3b82f6',
          indigo: '#6366f1',
          emerald: '#10b981',
          gold: '#f59e0b',
          rose: '#f43f5e',
        },
        text: {
          primary: '#e8ecf4',
          secondary: '#9aa4b8',
          muted: '#5b6a80',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'Fira Code', 'monospace'],
      },
      borderRadius: {
        sm: '8px',
        md: '14px',
        lg: '20px',
        xl: '28px',
        '2xl': '36px',
      },
      boxShadow: {
        card: '0 1px 2px rgba(0,0,0,0.4), 0 4px 20px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.04)',
        'card-hover': '0 4px 40px rgba(0,0,0,0.55), 0 0 0 1px rgba(6,182,212,0.3), 0 0 60px rgba(6,182,212,0.08)',
        elevated: '0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(6,182,212,0.25)',
      },
      backgroundImage: {
        'gradient-text': 'linear-gradient(135deg, #67e8f9 0%, #22d3ee 20%, #3b82f6 45%, #6366f1 65%, #8b5cf6 85%, #67e8f9 100%)',
        'gradient-btn': 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 60%, #6366f1 100%)',
      },
      animation: {
        'gradient-flow': 'gradientFlow 6s ease-in-out infinite',
        'pulse-dot': 'pulseDot 2.5s infinite',
      },
      keyframes: {
        gradientFlow: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '25%': { backgroundPosition: '100% 0%' },
          '50%': { backgroundPosition: '100% 100%' },
          '75%': { backgroundPosition: '0% 100%' },
        },
        pulseDot: {
          '0%, 100%': { boxShadow: '0 0 12px rgba(6,182,212,0.5)' },
          '50%': { boxShadow: '0 0 28px rgba(6,182,212,0.5), 0 0 50px rgba(6,182,212,0.5)' },
        },
      },
    },
  },
  plugins: [],
};
