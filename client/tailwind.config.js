/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  screens: {
    xs: { max: "640px" },
  },

  plugins: [require("daisyui")],
  daisyui: {
    themes: ["light", "dark", "synthwave"], // Add all the themes you want to use
  },
};
