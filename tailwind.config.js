// tailwind.config.js
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-quantico)', 'monospace'],
        mono: ['var(--font-quantico)', 'monospace'],
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
