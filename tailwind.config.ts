import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        offwhite: "#F4EFE7",
        bege: "#E4D5C3",
        dourado: "#C4A36A",
        marrom: "#75665A",
        grafite: "#292522",
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      borderRadius: { suave: "0.75rem" },
    },
  },
  plugins: [],
};

export default config;
