import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Natural, earthy palette taken from the Flowsha logo, which is exactly two
        // colours: a green figure (#4c7252) and a burnt-orange hoop (#d3793b).
        cream: '#f7f1e3', // type + logo figure on the dark canvas
        sand: '#efe5d1', // alt section / card background
        ink: '#2e2a24', // body text on light sections
        forest: { DEFAULT: '#4c7252', dark: '#2b402e' }, // logo green + its dark shade (page canvas)
        sage: '#7f9a7a', // light tint of the logo green
        clay: '#7a5240', // brown

        // The orange comes in three steps, because one orange cannot carry both small
        // text on a dark canvas and cream text on a solid fill. Same hue (24°) throughout.
        // - `terracotta` is the logo orange exactly. Graphics, icons, fills, and display
        //   type 24px and up. Only 3.5:1 on forest-dark, so it must NOT carry small text.
        // - `terracotta.light` is 4.9:1 on forest-dark. Small text, labels, links,
        //   borders, and button fills paired with `text-forest-dark`.
        // - `terracotta.deep` is 4.6:1 under cream. Solid orange blocks that carry cream
        //   text — the primary CTA and every form submit button.
        terracotta: { DEFAULT: '#d3793b', light: '#e79a5c', deep: '#a95720' },

        // Legacy. The logo has no yellow, so mustard is retired from the live site and
        // survives only for the /styles prototype gallery (noindex, internal-only).
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
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-14px)' },
        },
      },
      animation: {
        'spin-slow': 'spin-slow 28s linear infinite',
        float: 'float 7s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
