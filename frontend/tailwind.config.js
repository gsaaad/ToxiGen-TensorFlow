/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "toxic-red": "#ef4444",
        "safe-green": "#22c55e",
        "warning-yellow": "#eab308",
      },
    },
  },
  plugins: [],
};
