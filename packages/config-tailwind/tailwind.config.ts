import type { Config } from "tailwindcss";
import colors from 'tailwindcss/colors';
import tailwindAnimate from "tailwindcss-animate"
import tailwindAria from "tailwindcss-react-aria-components"

module.exports = {
	content: {
		files: [
			"./app/**/*.{ts,tsx}",
			"./src/**/*.{ts,tsx}",
			"../../packages/ui/src/**/*.{ts,tsx}",
			"../../packages/components/src/**/*.{ts,tsx}",
		],
	},
	darkMode: ["class"],
	theme: {
		colors: {
			black: colors.black,
			white: colors.white,
			transparent: 'transparent',
			current: 'currentColor',
			inherit: colors.inherit
		},
		borderRadius: {
			none: "0",
			sm: "16px",
			md: "24px",
			lg: "28px",
			xl: "32px"
		},
		extend: {
			backgroundImage: {
				'gradient-radial': 'radial-gradient(var(--gradient-color-stops))',
				'gradient-radial-to-tr': 'radial-gradient(115% 90% at 0% 100%, var(--tw-gradient-stops))',
				'gradient-radial-to-tl': 'radial-gradient(115% 90% at 100% 100%, var(--tw-gradient-stops))',
				'gradient-radial-to-br': 'radial-gradient(90% 115% at 0% 0%, var(--tw-gradient-stops))',
				'gradient-radial-to-bl': 'radial-gradient(90% 115% at 100% 0%, var(--tw-gradient-stops))',
			},
			colors: {
				// Custom UI-colors of Project Fasberry
				'biloba-flower': {
					'50': '#f6f4fe',
					'100': '#efebfc',
					'200': '#e1d9fb',
					'300': '#beabf6',
					'400': '#af93f2',
					'500': '#9567eb',
					'600': '#8647e0',
					'700': '#7735cc',
					'800': '#632cab',
					'900': '#53268c',
					'950': '#33165f',
				},
				'puerto-rico': {
					'50': '#eefffa',
					'100': '#c6fff2',
					'200': '#8effe7',
					'300': '#4dfbda',
					'400': '#19e8c7',
					'500': '#00cdb0',
					'600': '#00a491',
					'700': '#028375',
					'800': '#08675e',
					'900': '#0c554e',
					'950': '#003431',
				},
				'caribbean-green': {
					'50': '#eafff8',
					'100': '#cdfeec',
					'200': '#a0fade',
					'300': '#63f2ce',
					'400': '#25e2b9',
					'500': '#00c8a3',
					'600': '#00a486',
					'700': '#00836f',
					'800': '#006759',
					'900': '#00554a',
					'950': '#00302b',
				},
				gold: {
					'50': '#fffdea',
					'100': '#fff6c5',
					'200': '#ffee85',
					'300': '#ffde46',
					'400': '#ffcc1b',
					'500': '#ffaa00',
					'600': '#e28100',
					'700': '#bb5902',
					'800': '#984508',
					'900': '#7c380b',
					'950': '#481c00',
				},
				contessa: {
					'50': '#fbf5f5',
					'100': '#f7e9e9',
					'200': '#f1d7d7',
					'300': '#e7baba',
					'400': '#d79292',
					'500': '#c87575',
					'600': '#af5353',
					'700': '#934242',
					'800': '#7a3a3a',
					'900': '#673535',
					'950': '#371818',
				},
				red: {
					'50':  '#FDF6F6',
					'100': '#FBE8E8',
					'200': '#F6C9CA',
					'300': '#F1A8AB',
					'400': '#EC878B',
					'500': '#E66A6D',
					'600': '#C65558',
					'700': '#A44647',
					'800': '#833736',
					'900': '#692B2B',
					'950': '#471D1E',
				},
				green: {
					'50':  '#F3FBF3',
					'100': '#DFF7DF',
					'200': '#BFEFBF',
					'300': '#99E699',
					'400': '#77DD77',
					'500': '#5CC85C',
					'600': '#45A045',
					'700': '#348034',
					'800': '#296629',
					'900': '#1F4E1F',
					'950': '#122F12',
				},
				pink: {
					'50': '#fff1f3',
					'100': '#ffe3e7',
					'200': '#ffc0cb',
					'300': '#ffa2b3',
					'400': '#fe6e8b',
					'500': '#f83b66',
					'600': '#e51951',
					'700': '#c20e43',
					'800': '#a20f40',
					'900': '#8a113c',
					'950': '#4d041c',
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
					'950': '#2a2a2a',
				},
				emerald: {
					'50': '#effef6',
					'100': '#dafeec',
					'200': '#b8fad8',
					'300': '#81f4ba',
					'400': '#43e593',
					'500': '#1acd73',
					'600': '#11bd67',
					'700': '#10854b',
					'800': '#12693e',
					'900': '#115635',
					'950': '#03301c',
				},
				// Donate colors
				'player-border': "#2a2a4c",
				'player-background': "#8589ae",
				'authentic-border': "#7b1940",
				'authentic-background': "#cb3671",
				'loyal-border': "#324b00",
				'loyal-background': "#6e9d00",
				'helper-border': "#002960",
				'helper-background': "#00479f",
				'arkhont-border': "#00744c",
				'arkhont-background': "#00ac46",
				'dev-border': "",
				'dev-background': ""
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
						opacity: "0"
					},
					"100%": {
						opacity: "1"
					},
				},
				"fade-out": {
					"0%": {
						opacity: "1"
					},
					"100%": {
						opacity: "0"
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
						"background-color": "#b0b0b0"
					},
					"10%": {
						"background-color": "#6d6d6d"
					},
					"100%": {
						"background-color": "#212121"
					}
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
				"shimmer": {
					"100%": {
						"transform": "translateX(100%)",
					},
				},
			},
			animation: {
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out",
				"fade-in": 'fade-in 1s ease-in-out 0.25s 1',
				"fade-out": 'fade-out 1s ease-out 0.25s 1',
				"fade-in-down": 'fade-in-down 1s ease-in 0.25s 1',
				"fade-in-left": 'fade-in-left 1s ease-in-out 0.25s 1',
				"fade-in-right": 'fade-in-right 1s ease-in-out 0.25s 1',
				"fade-in-up": 'fade-in-up 1s ease-in-out 0.25s 1',
				"flash-fade": "flash-fade 3s ease-out 1"
			},
		},
	},
	plugins: [
		tailwindAnimate,
		tailwindAria
	],
} satisfies Config