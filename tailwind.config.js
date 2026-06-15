/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ['class'],
	content: [
		'./pages/**/*.{ts,tsx}',
		'./components/**/*.{ts,tsx}',
		'./app/**/*.{ts,tsx}',
		'./src/**/*.{ts,tsx}',
	],
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px',
			},
		},		extend: {
			fontFamily: {
				sans: [
					'-apple-system',
					'BlinkMacSystemFont',
					'SF Pro Display',
					'SF Pro Text',
					'Helvetica Neue',
					'Arial',
					'sans-serif',
				],
				display: [
					'Playfair Display',
					'Georgia',
					'serif',
				],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				pageBg: '#F5FBF5',
				pageBgLight: '#EAF7EF',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: '#4B8C6D',
					light: '#A3E4A1',
					dark: '#2B5D3A',
					foreground: 'hsl(var(--primary-foreground))',
				},
				secondary: {
					DEFAULT: '#4A90E2',
					foreground: 'hsl(var(--secondary-foreground))',
				},
				accent: {
					DEFAULT: '#F5A623',
					foreground: 'hsl(var(--accent-foreground))',
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))',
				},
				muted: {
					DEFAULT: '#D3EAD3',
					foreground: 'hsl(var(--muted-foreground))',
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))',
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))',
				},
				emerald: '#3E8E5E',
				'emerald-dark': '#2E7048',
				forest: '#2F6B45',
				foregroundDark: '#1F2A24',
				foregroundMuted: '#6B9E7E',
				foregroundSecondary: '#4A5E52',
				foregroundTertiary: '#6B7A70',
				foregroundPlaceholder: '#8A998F',
				stroke: {
					light: '#BFE3CC',
					muted: '#CDEAD8',
				},
				surface: {
					soft: '#F0FAF3',
					success: '#DCF1E4',
				},
				gradient: {
					mid: '#E0F3E7',
					end: '#D2EEDD',
				},
				link: '#2E8B57',
				luxury: '#FFD700',
				neutral: '#8E9C8E',
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
			},
			keyframes: {
				'accordion-down': {
					from: { height: 0 },
					to: { height: 'var(--radix-accordion-content-height)' },
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: 0 },
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
			},
		},
	},
	plugins: [require('tailwindcss-animate')],
}
