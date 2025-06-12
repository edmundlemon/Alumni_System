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
      animation: {
        marquee: "marquee 40s linear infinite",
        "marquee-reverse": "marquee-reverse 40s linear infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-30%)" },
        },
        "marquee-reverse": {
          "0%": { transform: "translateX(-40%)" },
          "100%": { transform: "translateX(0%)" },
        },
      },
      
    },
  },
  plugins: [require('@tailwindcss/line-clamp'),],
  
};
