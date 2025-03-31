/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Eid-inspired color palette
        eid: {
          emerald: {
            50: "#f0fdf5",
            100: "#dcfce8",
            200: "#bbf7d1",
            300: "#86efac",
            400: "#4ade80",
            500: "#22c55e",
            600: "#16a34a",
            700: "#15803d",
            800: "#166534",
            900: "#14532d",
            950: "#052e16",
          },
          gold: {
            50: "#fffbeb",
            100: "#fef3c7",
            200: "#fde68a",
            300: "#fcd34d",
            400: "#fbbf24",
            500: "#f59e0b",
            600: "#d97706",
            700: "#b45309",
            800: "#92400e",
            900: "#78350f",
            950: "#451a03",
          },
          purple: {
            50: "#faf5ff",
            100: "#f3e8ff",
            200: "#e9d5ff",
            300: "#d8b4fe",
            400: "#c084fc",
            500: "#a855f7",
            600: "#9333ea",
            700: "#7e22ce",
            800: "#6b21a8",
            900: "#581c87",
            950: "#3b0764",
          },
          cream: {
            50: "#fefdf9",
            100: "#fdf8ee",
            200: "#fbf2de",
            300: "#f7e5c2",
            400: "#f0d192",
            500: "#e9c46a",
            600: "#d4a94e",
            700: "#b38b3d",
            800: "#8c6d30",
            900: "#6f5626",
          }
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-geist-mono)"],
        display: ["var(--font-display)"]
      },
      backgroundImage: {
        "eid-pattern": "url('/images/eid-pattern.svg')",
        "crescent-moon": "url('/images/crescent-moon.svg')",
        "lantern": "url('/images/lantern.svg')",
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      animation: {
        "card-flip": "flip 1s ease forwards",
        "fade-in": "fadeIn 0.5s ease-in forwards",
        "float": "float 6s ease-in-out infinite",
        "tilt": "tilt 10s infinite ease-in-out",
        "shimmer": "shimmer 2s infinite linear",
        "pulse-glow": "pulse-glow 4s infinite ease-in-out",
      },
      keyframes: {
        flip: {
          "0%": { transform: "rotateY(0deg)" },
          "100%": { transform: "rotateY(180deg)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        tilt: {
          "0%, 100%": { transform: "rotate(-1deg)" },
          "50%": { transform: "rotate(1deg)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.6", filter: "blur(8px)" },
          "50%": { opacity: "1", filter: "blur(10px)" },
        },
      },
      borderRadius: {
        "4xl": "2rem",
      },
      boxShadow: {
        "soft": "0 2px 10px rgba(0, 0, 0, 0.05), 0 10px 20px -5px rgba(0, 0, 0, 0.04)",
        "glow": "0 0 15px rgba(16, 185, 129, 0.5)",
        "gold-glow": "0 0 15px rgba(245, 158, 11, 0.5)",
      },
      transitionDuration: {
        '2000': '2000ms',
      },
      backgroundSize: {
        'auto': 'auto',
        'cover': 'cover',
        'contain': 'contain',
        '200%': '200%',
      },
      screens: {
        'xs': '480px',
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
}; 