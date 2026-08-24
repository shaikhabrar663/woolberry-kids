/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory: "#FAF8F5",
        cream: "#F4EFEA",
        taupe: "#8C827A",
        cocoa: "#3D312A",
        sage: "#8A9A86",
        powder: "#C5D3E8",
        rose: "#D9A5A0",
        border: "#E8E2D9",
      },
      fontFamily: {
        serif: ["Playfair Display", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};