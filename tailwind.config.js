import defaultTheme from "tailwindcss/defaultTheme";
import forms from "@tailwindcss/forms";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php",
    "./storage/framework/views/*.php",
    "./resources/views/**/*.blade.php",
    "./resources/js/**/*.jsx",
    "node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}",
  ],

  theme: {
    extend: {
      backgroundColor: {
        "bg-opacity-gray": "hsla(240, 3%, 94%, 0.5)",
      },
      backgroundSize: { "300-300": "300% 300%" },
      keyframes: {
        timeLine: {
          "0%": { width: "0" },
          "100%": { width: "100%" },
        },
        showFromBottom: {
          "0%": {
            bottom: "-100%",
          },
          "100%": {
            bottom: "1rem",
            opacity: 1,
          },
        },
        resultBar: {
          "0%": {
            width: "0",
          },
          "100%": {
            width: "var(--barWidth)",
          },
        },
        logoAnimation: {
          "0%": { backgroundPosition: "0% 0%" },
          "50%": { backgroundPosition: "100% 0%" },
          "100%": { backgroundPosition: "0% 0%" },
        },
        pulse: {
          "0%": { boxShadow: "0 0 0 0px rgba(0, 0, 0, 0.2)" },
          "100%": { boxShadow: "0 0 0 20px rgba(0, 0, 0, 0)" },
        },
        wrongMatch: {
          "0%": { rotate: "0deg" },
          "30%": { rotate: "2deg" },
          "40%": { rotate: "-2deg" },
          "50%": { rotate: "4deg" },
          "60%": { rotate: "-2deg" },
          "70%": { rotate: "2deg" },
          "100%": { rotate: "0" },
        },
        rotateHourglass: {
          "0%": { rotate: "0deg" },
          "10%": { rotate: "180deg" },
          "100%": { rotate: "180deg" },
        },
        wavingFlag: {
          "0%": { rotate: "15deg" },
          "25%": { rotate: "-15deg" },
          "50%": { rotate: "15deg" },
          "75%": { rotate: "-15deg" },
          "100%": { rotate: "15deg" },
        },
        loading: {
          "0%": { rotate: "0deg" },
          "10%": { rotate: "15deg" },
          "20%": { rotate: "30deg" },
          "100%": { rotate: "360deg" },
        },
      },
      animation: {
        "time-line": "timeLine 10s linear forwards",
        "show-from-bottom": "showFromBottom 1s ease forwards",
        "result-bar": "resultBar 2s ease-out forwards",
        "logo-animation": "logoAnimation 10s ease infinite",
        "pulse-loading": "pulse .5s ease infinite",
        "wrong-match": "wrongMatch .5s ease-in-out",
        hourglass: "rotateHourglass 3s ease-in-out infinite",
        "waving-flag": "wavingFlag 5s ease-in-out infinite",
        loading: "loading 1s ease-in-out infinite",
      },
      fontFamily: {
        sans: ["Figtree", ...defaultTheme.fontFamily.sans],
      },
    },
  },

  plugins: [forms, require("flowbite/plugin")],
};