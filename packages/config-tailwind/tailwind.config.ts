import type { Config } from "tailwindcss";
import colors from "tailwindcss/colors";
import tailwindAnimate from "tailwindcss-animate";
import tailwindAria from "tailwindcss-react-aria-components";
import tailwindScrollbar from "tailwind-scrollbar";

module.exports = {
  content: {
    files: [
      "./src/**/*.{js,ts,tsx}",
      "../../packages/ui/src/**/*.{ts,tsx}",
      "../../packages/components/src/**/*.{ts,tsx}",
      "../../packages/plate-editor/src/**/*.{ts,tsx}"
    ],
  },
  theme: {
    colors: {
      black: colors.black,
      white: colors.white,
      transparent: "transparent",
      current: "currentColor",
      inherit: colors.inherit,
    },
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--gradient-color-stops))",
        "gradient-radial-to-tr":
          "radial-gradient(115% 90% at 0% 100%, var(--tw-gradient-stops))",
        "gradient-radial-to-tl":
          "radial-gradient(115% 90% at 100% 100%, var(--tw-gradient-stops))",
        "gradient-radial-to-br":
          "radial-gradient(90% 115% at 0% 0%, var(--tw-gradient-stops))",
        "gradient-radial-to-bl":
          "radial-gradient(90% 115% at 100% 0%, var(--tw-gradient-stops))",
      },
      colors: {
        // Custom UI-colors of Project Repliq
        "biloba-flower": {
          "50": "#f6f4fe",
          "100": "#efebfc",
          "200": "#e1d9fb",
          "300": "#beabf6",
          "400": "#af93f2",
          "500": "#9567eb",
          "600": "#8647e0",
          "700": "#7735cc",
          "800": "#632cab",
          "900": "#53268c",
          "950": "#33165f",
        },
        gold: {
          "50": "#fffdea",
          "100": "#fff6c5",
          "200": "#ffee85",
          "300": "#ffde46",
          "400": "#ffcc1b",
          "500": "#ffaa00",
          "600": "#e28100",
          "700": "#bb5902",
          "800": "#984508",
          "900": "#7c380b",
          "950": "#481c00",
        },
        contessa: {
          '50': '#fbf4f7',
          '100': '#f8ebf0',
          '200': '#f2d8e2',
          '300': '#e8b9cb',
          '400': '#db93ac',
          '500': '#ca6a88',
          '600': '#b64c68',
          '700': '#9c3a52',
          '800': '#813344',
          '900': '#6d2e3c',
          '950': '#41161f',
        },
        red: {
          "50": "#FDF6F6",
          "100": "#FBE8E8",
          "200": "#F6C9CA",
          "300": "#F1A8AB",
          "400": "#EC878B",
          "500": "#E66A6D",
          "600": "#C65558",
          "700": "#A44647",
          "800": "#833736",
          "900": "#692B2B",
          "950": "#471D1E",
        },
        green: {
          '50': '#f1fcf2',
          '100': '#e0f8e1',
          '200': '#c2f0c5',
          '300': '#92e399',
          '400': '#62d06c',
          '500': '#34b340',
          '600': '#269330',
          '700': '#217429',
          '800': '#1f5c25',
          '900': '#1b4c21',
          '950': '#0a290f',
        },
        pink: {
          "50": "#fff1f3",
          "100": "#ffe3e7",
          "200": "#ffc0cb",
          "300": "#ffa2b3",
          "400": "#fe6e8b",
          "500": "#f83b66",
          "600": "#e51951",
          "700": "#c20e43",
          "800": "#a20f40",
          "900": "#8a113c",
          "950": "#4d041c",
        },
        shark: {
          '50': '#f6f6f6',
          '100': '#e7e7e7',
          '200': '#d1d1d1',
          '300': '#b0b0b0',
          '400': '#888888',
          '500': '#6d6d6d',
          '600': '#5d5d5d',
          '700': '#4f4f4f',
          '800': '#454545',
          '900': '#3d3d3d',
          '950': '#1c1c1c',
        },
        emerald: {
          "50": "#effef6",
          "100": "#dafeec",
          "200": "#b8fad8",
          "300": "#81f4ba",
          "400": "#43e593",
          "500": "#1acd73",
          "600": "#11bd67",
          "700": "#10854b",
          "800": "#12693e",
          "900": "#115635",
          "950": "#03301c",
        },
        'blue': {
          '50': '#f2f8fd',
          '100': '#e4f0fa',
          '200': '#c3e1f4',
          '300': '#8fc9ea',
          '400': '#53acdd',
          '500': '#2a89be',
          '600': '#1e74ab',
          '700': '#195e8b',
          '800': '#195073',
          '900': '#1a4360',
          '950': '#112b40',
        },
        'kaitoke-green': {
          '50': '#effef6',
          '100': '#dafeeb',
          '200': '#b7fbd8',
          '300': '#80f5b9',
          '400': '#41e793',
          '500': '#18cf72',
          '600': '#0eab5c',
          '700': '#0f864a',
          '800': '#116a3e',
          '900': '#0f5031',
          '950': '#03301c',
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          "0%": {
            opacity: "0",
          },
          "100%": {
            opacity: "1",
          },
        },
        "fade-out": {
          "0%": {
            opacity: "1",
          },
          "100%": {
            opacity: "0",
          },
        },
        "fade-in-down": {
          "0%": {
            opacity: "0",
            transform: "translate3d(0, -100%, 0)",
          },
          "100%": {
            opacity: "1",
            transform: "translate3d(0, 0, 0)",
          },
        },
        "flash-fade": {
          "0%": {
            "background-color": "#b0b0b0",
          },
          "10%": {
            "background-color": "#6d6d6d",
          },
          "100%": {
            "background-color": "#212121",
          },
        },
        "fade-in-left": {
          "0%": {
            opacity: "0",
            transform: "translate3d(-100%, 0, 0)",
          },
          "100%": {
            opacity: "1",
            transform: "translate3d(0, 0, 0)",
          },
        },
        shimmer: {
          "100%": {
            transform: "translateX(100%)",
          },
        },
        rippling: {
          "0%": {
            opacity: "1",
          },
          "100%": {
            transform: "scale(2)",
            opacity: "0",
          },
        },
      },
      animation: {
        rippling: "rippling 0.2s ease-out",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 1s ease-in-out 0.25s 1",
        "fade-out": "fade-out 1s ease-out 0.25s 1",
        "fade-in-down": "fade-in-down 1s ease-in 0.25s 1",
        "fade-in-left": "fade-in-left 1s ease-in-out 0.25s 1",
        "fade-in-right": "fade-in-right 1s ease-in-out 0.25s 1",
        "fade-in-up": "fade-in-up 1s ease-in-out 0.25s 1",
        "flash-fade": "flash-fade 3s ease-out 1",
      },
    },
  },
  plugins: [tailwindAnimate, tailwindAria, tailwindScrollbar],
} satisfies Config;