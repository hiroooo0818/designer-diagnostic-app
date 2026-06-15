/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'brand-text': '#000000',
        'brand-primary': '#B5D2CC',
        'brand-accent': '#F1BF42',
        'brand-emphasis': '#FF3318',
        'brand-dark-green': '#162713',
        'brand-bg': '#f5f5f5',
        'brand-border': '#dddddd',
      },
      fontFamily: {
        serif: [
          '"Yu Mincho"',
          '"游明朝"',
          'YuMincho',
          '"Hiragino Mincho ProN"',
          'serif',
        ],
        sans: [
          '"Yu Gothic"',
          '"游ゴシック"',
          'YuGothic',
          '"Hiragino Kaku Gothic ProN"',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
};
