/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundColor: {
        "dark-background": "#000000", // Custom dark background color
        "light-background": "#ffffff", // Custom light background color
      },
    },
  },
  screens: {
    custom: "640px",
  },

  plugins: [require("daisyui")],
  daisyui: {
    themes: ["light", "dark"], // Add all the themes you want to use
  },
};
