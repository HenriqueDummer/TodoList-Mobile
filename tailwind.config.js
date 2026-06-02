/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.tsx", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        auth: {
          background: "#050505",
          surface: "#1A1A1A",
          border: "#263244",
          text: "#FFFFFF",
          muted: "#C6D4E5",
          placeholder: "#8390A8",
          icon: "#7D8CA6",
          purple: "#A020F0",
          blue: "#2F80ED",
          error: "#FF6B6B",
        },
      },
    },
  },
  plugins: [],
}
