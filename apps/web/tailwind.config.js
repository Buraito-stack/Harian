/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Dark Theme (Stellar Mode)
        stellar: {
          bg: "#0B0E1A",
          surface: "#151B2D",
          border: "#2D3748",
          glow: "var(--color-stellar-glow)",
        },
        // Light Theme (Ethereal Mode)
        ethereal: {
          bg: "#F8FAFC",
          surface: "#FFFFFF",
          glow: "#DBEAFE",
        },
        // Accent Colors
        mornye: {
          DEFAULT: "#7A9CFF",
          light: "#3B82F6",
        },
        starlight: "#E0E7FF",
        // Semantic colors mapped to CSS variables
        background: "var(--color-background)",
        surface: "var(--color-surface)",
        "surface-hover": "var(--color-surface-hover)",
        border: "var(--color-border)",
        "stellar-glow": "var(--color-stellar-glow)",
        accent: "var(--color-accent)",
        "accent-hover": "var(--color-accent-hover)",
        "accent-glow": "var(--color-accent-glow)",
        "text-primary": "var(--color-text-primary)",
        "text-secondary": "var(--color-text-secondary)",
        "text-muted": "var(--color-text-muted)",
      },
      boxShadow: {
        glow: "0 0 20px var(--color-accent-glow)",
        "glow-sm": "0 0 10px var(--color-accent-glow)",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-out",
        "slide-up": "slideUp 0.3s ease-out",
        "scale-in": "scaleIn 0.2s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
    },
  },
  plugins: [],
};
