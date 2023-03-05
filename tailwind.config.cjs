// eslint-disable-next-line @typescript-eslint/no-var-requires
const plugin = require("tailwindcss/plugin");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/react-tailwindcss-select/dist/index.esm.js",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#0a0a0a",
        primary: {
          light: "#ffff0045",
          DEFAULT: "#b38325",
        },
        baseText: "#eee",
        sectionTitle: "#787878",
        error: "#dd2c00",
      },
      boxShadow: {
        sections: "#ffffff2e 0px -2px 6px 0px",
      },
      backgroundImage: {
        "space-image": "url(/FondoEspacial.png)",
      },
      screens: {
        "xs-sm": "425px",
        "big-md": "920px",
      },
    },
  },
  plugins: [
    plugin(function ({ addUtilities, addComponents }) {
      addComponents({
        ".primary-button": {
          padding: "0.5em",
          background: "rgba(179, 131, 37, 0.8)",
          border: "none",
          "border-radius": "5px",
          display: "flex",
          "align-items": "center",
          "justify-content": "center",
          gap: "2px",
          cursor: "pointer",
          "font-weight": "600",
          "text-transform": "uppercase",
          position: "relative",
        },
        ".primary-button:hover:enabled, a.primary-button:hover": {
          background: "rgba(179, 131, 37)",
        },
        ".primary-button:disabled": {
          opacity: 0.5,
          color: "rgb(0 0 0 / .5)",
          cursor: "not-allowed",
        },
      }),
        addUtilities({
          ".perspective": {
            perspective: "1200px",
          },
          ".absolute-center": {
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          },
          ".lit-icon::before": {
            content: "'🔥 '",
          },
          ".animation-reset": {
            "animation-name": "none",
          },
        });
    }),
  ],
};
