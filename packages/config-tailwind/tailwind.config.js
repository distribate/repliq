const colors  = require('tailwindcss/colors')

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
				
				// //
				// Custom UI-colors of Project Fasberry
				// //
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
					'50': '#fff1f1',
					'100': '#ffe0e0',
					'200': '#ffc6c6',
					'300': '#ff9f9f',
					'400': '#ff6868',
					'500': '#fb3e3e',
					'600': '#e91919',
					'700': '#c41111',
					'800': '#a21212',
					'900': '#861616',
					'950': '#490606',
				},
				green: {
					'50': '#f0fdf2',
					'100': '#dbfde1',
					'200': '#baf8c6',
					'300': '#84f199',
					'400': '#4ae168',
					'500': '#1fc841',
					'600': '#14a531',
					'700': '#13822b',
					'800': '#156627',
					'900': '#135422',
					'950': '#042f0f',
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
					'950': '#212121',
				},
				'emerald': {
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
				
				//
				// Donate colors
				//
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
				'dev-background': "",
				
				border: "hsl(var(--border))",
				input: "hsl(var(--input))",
				ring: "hsl(var(--ring))",
				background: "hsl(var(--background))",
				foreground: "hsl(var(--foreground))",
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
				"shimmer": {
					"100%": {
						"transform": "translateX(100%)",
					},
				},
				"accordion-up": {
					from: { height: "var(--radix-accordion-content-height)" },
					to: { height: "0" },
				},
				'highlight': {
					'0%': {
						backgroundColor: 'rgba(255, 255, 0, 0.5)'
					},
					'100%': {
						backgroundColor: 'transparent'
					},
				},
				"fade-in": {
					"0%": {
						opacity: 0
					},
					"100%": {
						opacity: 1
					},
				},
				"fade-out": {
					"0%": {
						opacity: 1
					},
					"100%": {
						opacity: 0
					},
				},
				"fade-in-down": {
					"0%": {
						opacity: 0,
						transform: "translate3d(0, -100%, 0)",
					},
					"100%": {
						opacity: 1,
						transform: "translate3d(0, 0, 0)",
					},
				},
				"fade-in-top-left": {
					"0%": {
						opacity: 0,
						transform: "translate3d(-100%, -100%, 0)",
					},
					"100%": {
						opacity: 1,
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
				"fade-in-top-right": {
					"0%": {
						opacity: 0,
						transform: "translate3d(100%, -100%, 0)",
					},
					"100%": {
						opacity: 1,
						transform: "translate3d(0, 0, 0)",
					},
				},
				"fade-in-bottom-left": {
					"0%": {
						opacity: 0,
						transform: "translate3d(100%, 100%, 0)",
					},
					"100%": {
						opacity: 1,
						transform: "translate3d(0, 0, 0)",
					},
				},
				"fade-in-bottom-right": {
					"0%": {
						opacity: 0,
						transform: "translate3d(-100%, 100%, 0)",
					},
					"100%": {
						opacity: 1,
						transform: "translate3d(0, 0, 0)",
					},
				},
				"fade-in-bounce-right": {
					"0%": {
						opacity: 0,
						transform: "translate3d(100%, 0%, 0)",
					},
					"33%": {
						opacity: 0.5,
						transform: "translate3d(0%, 0%, 0)",
					},
					"66%": {
						opacity: 0.7,
						transform: "translate3d(20%, 0%, 0)",
					},
					"100%": {
						opacity: 1,
						transform: "translate3d(0, 0, 0)",
					},
				},
				"fade-in-bounce-left": {
					"0%": {
						opacity: 0,
						transform: "translate3d(-100%, 0%, 0)",
					},
					"33%": {
						opacity: 0.5,
						transform: "translate3d(0%, 0%, 0)",
					},
					"66%": {
						opacity: 0.7,
						transform: "translate3d(-20%, 0%, 0)",
					},
					"100%": {
						opacity: 1,
						transform: "translate3d(0, 0, 0)",
					},
				},
				"fade-in-bouncedown": {
					"0%": {
						opacity: 0,
						transform: "translate3d(0%, -100%, 0)",
					},
					"33%": {
						opacity: 0.5,
						transform: "translate3d(0%, 0%, 0)",
					},
					"66%": {
						opacity: 0.7,
						transform: "translate3d(0%, -20%, 0)",
					},
					"100%": {
						opacity: 1,
						transform: "translate3d(0, 0, 0)",
					},
				},
				"fade-in-bounceup": {
					"0%": {
						opacity: 0,
						transform: "translate3d(0%, 100%, 0)",
					},
					"33%": {
						opacity: 0.5,
						transform: "translate3d(0%, 0%, 0)",
					},
					"66%": {
						opacity: 0.7,
						transform: "translate3d(0%, 20%, 0)",
					},
					"100%": {
						opacity: 1,
						transform: "translate3d(0, 0, 0)",
					},
				},
				"fade-in-left": {
					"0%": {
						opacity: 0,
						transform: "translate3d(-100%, 0, 0)",
					},
					"100%": {
						opacity: 1,
						transform: "translate3d(0, 0, 0)",
					},
				},
				"fade-in-right": {
					"0%": {
						opacity: 0,
						transform: "translate3d(100%, 0, 0)",
					},
					"100%": {
						opacity: 1,
						transform: "translate3d(0, 0, 0)",
					},
				},
				"fade-in-up": {
					"0%": {
						opacity: 0,
						transform: "translate3d(0, 100%, 0)",
					},
					"100%": {
						opacity: 1,
						transform: "translate3d(0, 0, 0)",
					},
				},
				"fade-out-down": {
					"0%": {
						opacity: 1,
					},
					"100%": {
						opacity: 0,
						transform: "translate3d(0, 100%, 0)",
					},
				},
				"fade-out-left": {
					"0%": {
						opacity: 1,
					},
					"100%": {
						opacity: 0,
						transform: "translate3d(-100%, 0, 0)",
					},
				},
				"fade-out-top-left": {
					"0%": {
						opacity: 1,
					},
					"100%": {
						opacity: 0,
						transform: "translate3d(-100%, -100%, 0)",
					},
				},
				"fade-out-top-right": {
					"0%": {
						opacity: 1,
					},
					"100%": {
						opacity: 0,
						transform: "translate3d( 100%, -100%, 0)",
					},
				},
				"fade-out-right": {
					"0%": {
						opacity: 1,
					},
					"100%": {
						opacity: 0,
						transform: "translate3d(100%, 0, 0)",
					},
				},
			},
			animation: {
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out",
				fadein: 'fade-in 1s ease-in-out 0.25s 1',
				fadeout: 'fade-out 1s ease-out 0.25s 1',
				fadeindown: 'fade-in-down 1s ease-in 0.25s 1',
				fadeintopleft: 'fade-in-top-left 1s ease-out 0.25s 1',
				fadeintopright: 'fade-in-top-right 1s ease-out 0.25s 1',
				fadeinbottomleft: 'fade-in-bottom-left 1s ease-out 0.25s 1',
				fadeinbottomright: 'fade-in-bottom-right 1s ease-out 0.25s 1',
				fadeinleft: 'fade-in-left 1s ease-in-out 0.25s 1',
				fadeinbouncedown: 'fade-in-bouncedown 1s ease-in-out 0.25s 1',
				fadeinbounceup: 'fade-in-bounceup 1s ease-in-out 0.25s 1',
				fadeinbounceright: 'fade-in-bounce-right 1s ease-in-out 0.25s 1',
				fadeinbounceleft: 'fade-in-bounce-left 1s ease-in-out 0.25s 1',
				fadeinright: 'fade-in-right 1s ease-in-out 0.25s 1',
				fadeinup: 'fade-in-up 1s ease-in-out 0.25s 1',
				fadeoutdown: 'fade-out-down 1s ease-in-out 0.25s 1',
				fadeouttopleft: 'fade-out-top-left 1s ease-in-out 0.25s 1',
				fadeouttopright: 'fade-out-top-right 1s ease-in-out 0.25s 1',
				fadeoutleft: 'fade-out-left 1s ease-in-out 0.25s 1',
				fadeoutright: 'fade-out-right 1s ease-in-out 0.25s 1',
				fadeoutup: 'fade-out-up 1s ease-in-out 0.25s 1',
				'highlight': 'highlight 2s ease-out',
				"flash-fade": "flash-fade 3s ease-out 1"
			},
		},
	},
	plugins: [
		require("tailwindcss-animate"),
		require('tailwindcss-react-aria-components')
	],
}