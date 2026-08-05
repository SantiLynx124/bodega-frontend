/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        awning: {
          DEFAULT: "#1F4D3D",
          light: "#2C6650",
          dark: "#153728",
        },
        paper: {
          DEFAULT: "#F2ECD8",
          dark: "#E6DEC2",
          card: "#FBF8EF",
        },
        ink: {
          DEFAULT: "#1B1B18",
          soft: "#4A473E",
        },
        tag: {
          red: "#B23A2E",
          mustard: "#E3A72E",
        },
        stone: "#D8D2C0",
      },
      borderRadius: {
        tag: "8px",
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
        mono: ["'IBM Plex Mono'", "monospace"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(27,27,24,0.06), 0 1px 0 rgba(27,27,24,0.04)",
        sheet: "0 -8px 30px rgba(27,27,24,0.22)",
      },
      keyframes: {
        "slide-up": {
          "0%": { transform: "translateY(100%)" },
          "100%": { transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: 0, transform: "translateY(4px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
      },
      animation: {
        "slide-up": "slide-up 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
        "fade-in": "fade-in 0.3s ease-out",
      },
    },
  },
  plugins: [],
}
