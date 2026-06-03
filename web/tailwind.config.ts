import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Natural, earthy palette from the Flowsha brand brief.
        cream: '#f7f1e3', // page background
        sand: '#efe5d1', // alt section / card background
        ink: '#2e2a24', // body text
        forest: { DEFAULT: '#3f5a3a', dark: '#2c3f2a' },
        sage: '#7c8c6a',
        clay: '#7a5240', // brown
        terracotta: '#d2703a', // orange
        mustard: '#d8a534',
      },
      fontFamily: {
        display: ['var(--font-fraunces)', 'Georgia', 'serif'],
        sans: ['var(--font-nunito)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        script: ['var(--font-script)', 'var(--font-fraunces)', 'cursive'],
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'none' },
        },
        'spin-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        'spin-slow': 'spin-slow 28s linear infinite',
      },
    },
  },
  plugins: [],
};

export default config;
