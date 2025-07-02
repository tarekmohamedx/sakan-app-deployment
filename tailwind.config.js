/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-primary': '#086282',     
        'brand-secondary': '#185474',
        'brand-accent': '#72A2BD',
      }
    },
  },
  plugins: [],
}

