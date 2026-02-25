/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],  
	darkMode: "class",
	theme: {
		extend: {
			fontFamily: {
				sans: ['Lora', 'Georgia', 'Cambria', 'Times New Roman', 'Times', 'serif'],
			},
			typography: (theme) => ({
				DEFAULT: {
					css: {
						maxWidth: '65ch',
						color: theme('colors.gray.900'),
						lineHeight: '1.75',
						fontSize: '1.0625rem',
						p: {
							marginTop: '1.5em',
							marginBottom: '1.5em',
						},
						h2: {
							fontWeight: '700',
							marginTop: '2em',
							marginBottom: '1em',
							lineHeight: '1.3',
						},
						h3: {
							fontWeight: '600',
							marginTop: '1.6em',
							marginBottom: '0.6em',
						},
						code: {
							fontWeight: '500',
						},
						a: {
							fontWeight: '500',
							textDecoration: 'underline',
							textUnderlineOffset: '2px',
						},
					},
				},
				lg: {
					css: {
						fontSize: '1.125rem',
						lineHeight: '1.8',
						p: {
							marginTop: '1.5em',
							marginBottom: '1.5em',
						},
					},
				},
				invert: {
					css: {
						color: theme('colors.gray.100'),
						a: {
							color: theme('colors.blue.400'),
						},
						h2: {
							color: theme('colors.gray.100'),
						},
						h3: {
							color: theme('colors.gray.100'),
						},
						code: {
							color: theme('colors.gray.100'),
						},
						strong: {
							color: theme('colors.gray.100'),
						},
					},
				},
			}),
		},
	},
	plugins: [require('@tailwindcss/typography')],
}
