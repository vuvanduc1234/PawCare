/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary:    '#c9a96e',
        'primary-dark': '#9e7d48',
        secondary:  '#7a9e7e',
        danger:     '#c0675a',
        success:    '#7a9e7e',
        cream:      '#f5f0e8',
        'cream-dark': '#ede8de',
        off:        '#faf7f2',
        warm:       '#c9a96e',
        'warm-light': '#e8d5b0',
        'brown-dark': '#1a1209',
        'text-mid': '#5c4a2a',
        'text-light': '#8c7558',
      },
      fontFamily: {
        sans:    ['DM Sans', 'sans-serif'],
        display: ['Cormorant Garamond', 'serif'],
        heading: ['Cormorant Garamond', 'serif'],
        serif:   ['Cormorant Garamond', 'serif'],
      },
    },
  },
  plugins: [],
};