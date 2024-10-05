/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    screens: {
      fhd: '1920px',
      desktop: '1440px',
      labtop: '1024px',
      mob: '768px',
    },
    extend: {
      maxWidth: {
        fhd: 'var(--fhd)',
        desktop: 'var(--desktop)',
        labtop: 'var(--labtop)',
        mob: 'var(--mob)',
      },
    },
  },
  plugins: [],
};
