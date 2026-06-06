/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  mode: "jit",
  theme: {
    extend: {
      colors: {
        primary: "#f3f4f8",
        secondary: "#64748b",
        tertiary: "#ffffff",
        "black-100": "#eef0f6",
        "black-200": "#e2e5ef",
        "white-100": "#334155",
      },
      boxShadow: {
        card: "0px 10px 40px -10px rgba(100, 116, 139, 0.18)",
      },
      screens: {
        xs: "450px",
      },
      backgroundImage: {
        "hero-pattern": "url('/src/assets/herobg.png')",
      },
    },
  },
  plugins: [],
};
