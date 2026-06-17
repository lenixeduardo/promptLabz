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
			pageBg: 'var(--page-bg)',
				pageBgLight: 'var(--page-bg-light)',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'var(--primary)',
					light: 'var(--primary-light)',
					dark: 'var(--primary-dark)',
					foreground: 'hsl(var(--primary-foreground))',
				},
				secondary: {
					DEFAULT: 'var(--secondary)',
					foreground: 'hsl(var(--secondary-foreground))',
				},
				accent: {
					DEFAULT: 'var(--accent)',
					foreground: 'hsl(var(--accent-foreground))',
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))',
				},
				muted: {
					DEFAULT: 'var(--muted-default)',
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
				emerald: 'var(--emerald)',
				'emerald-dark': 'var(--emerald-dark)',
				forest: 'var(--forest)',
				foregroundDark: 'var(--foreground-dark)',
				foregroundMuted: 'var(--foreground-muted)',
				foregroundSecondary: 'var(--foreground-secondary)',
				foregroundTertiary: 'var(--foreground-tertiary)',
				foregroundPlaceholder: 'var(--foreground-placeholder)',
				stroke: {
					light: 'var(--stroke-light)',
					muted: 'var(--stroke-muted)',
				},
				surface: {
					soft: 'var(--surface-soft)',
					success: 'var(--surface-success)',
				},
				gradient: {
					mid: 'var(--gradient-mid)',
					end: 'var(--gradient-end)',
				},
				link: 'var(--link)',
				luxury: 'var(--luxury)',
				neutral: 'var(--neutral)',
				/* Semantic design tokens */
				bgPrimary: 'var(--bg-primary)',
				bgSecondary: 'var(--bg-secondary)',
				bgCardDark: 'var(--bg-card-dark)',
				textPrimary: 'var(--text-primary)',
				textSecondary: 'var(--text-secondary)',
				textMuted: 'var(--text-muted)',
				primaryGreen: 'var(--primary-green)',
				brandPurple: 'var(--brand-purple)',
				brandBlue: 'var(--brand-blue)',
				brandGold: 'var(--brand-gold)',
				brandOrange: 'var(--brand-orange)',
				statusPremium: 'var(--status-premium)',
				tag: {
					bgAdvanced: 'var(--tag-bg-advanced)',
					textAdvanced: 'var(--tag-text-advanced)',
					bgIntermediate: 'var(--tag-bg-intermediate)',
					textIntermediate: 'var(--tag-text-intermediate)',
					bgBasic: 'var(--tag-bg-basic)',
					textBasic: 'var(--tag-text-basic)',
				},
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
