import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#7C5DFA",
          light: "#9277FF",
        },
        ink: {
          900: "#0C0E16",
          800: "#1E2139",
          700: "#252945",
          600: "#373B53",
          500: "#494E6E",
          400: "#7E88C3",
          300: "#888EB0",
          200: "#DFE3FA",
          100: "#F8F8FB",
        },
        status: {
          paid: "#33D69F",
          pending: "#FF8F00",
          draft: "#373B53",
        },
        danger: {
          DEFAULT: "#EC5757",
          light: "#FF9797",
        },
      },
      fontFamily: {
        sans: ["'League Spartan'", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 10px 10px -10px rgba(72, 84, 159, 0.10)",
        modal: "0 10px 20px rgba(72, 84, 159, 0.25)",
      },
      keyframes: {
        slideIn: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        slideIn: "slideIn 0.3s ease-out",
        fadeIn: "fadeIn 0.2s ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
