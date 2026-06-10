/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  mode: "jit",
  theme: {
    extend: {
      colors: {
        primary: "#0ea5e9",
        secondary: "#64748b",
        tertiary: "#f1f5fb",
        "sky-main": "#0ea5e9",
        "indigo-main": "#4f46e5",
        "cyan-main": "#06b6d4",
        "page-bg": "#f8faff",
        "card-bg": "#ffffff",
        "text-dark": "#0f172a",
        "text-mid": "#334155",
        "white-100": "#f3f3f3",
      },
      boxShadow: {
        card: "0px 8px 32px rgba(14,165,233,0.10)",
        "card-hover": "0px 16px 48px rgba(14,165,233,0.18)",
      },
      screens: {
        xs: "450px",
      },
      backgroundImage: {
        "hero-pattern": "linear-gradient(135deg, #f0f7ff 0%, #eef0ff 50%, #f5f0ff 100%)",
      },
    },
  },
  plugins: [],
};
