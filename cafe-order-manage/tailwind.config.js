/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontSize: {
        "4xs":"4px",
        "3xs":"8px",
        "xxs":"10px",
      },
    },
  },
  plugins: [],
}
