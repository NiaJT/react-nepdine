/** @type {import('tailwindcss').Config} */
export default {
  content: [],
  theme: {
    extend: {
      colors: {
        background: "#f9fafb", // bg-background
        foreground: "#1f2937", // text-foreground
        border: "#e5e7eb", // border-border
        primary: "#FB8A22", // example primary color
        secondary: "#EA454C",
        muted: "#9ca3af", // text-muted
        ring: {
          50: "rgba(251,138,34,0.5)", // outline-ring/50
        },
      },
    },
  },
  plugins: [],
};
