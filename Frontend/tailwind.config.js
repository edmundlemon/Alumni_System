export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif'], 
      },
      colors: {
        'denim': '#1560bd',
        },
    },
  },
  plugins: [require('@tailwindcss/line-clamp'),],
};
