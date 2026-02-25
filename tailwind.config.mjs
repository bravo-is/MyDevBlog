/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],  
	darkMode: "class",
	theme: {
		extend: {
			fontFamily: {
				sans: ['Lora', 'Georgia', 'Cambria', 'Times New Roman', 'Times', 'serif'],
			},
			colors: {
				'accent-blue': '#8ECAE6',
			},
			typography: (theme) => ({
				DEFAULT: {
					css: {
						maxWidth: '65ch',
						color: theme('colors.gray.900'),
						lineHeight: '1.75',
						fontSize: '1.0625rem',
						p: { marginTop: '1.5em', marginBottom: '1.5em' },
						h2: { fontWeight: '700', marginTop: '2em', marginBottom: '1em', lineHeight: '1.3' },
						h3: { fontWeight: '600', marginTop: '1.6em', marginBottom: '0.6em' },
						code: { fontWeight: '500', padding: '0.2em 0.4em', borderRadius: '0.25rem' },
						'code::before': { content: '' },
						'code::after': { content: '' },
						pre: {
							backgroundColor: theme('colors.neutral.900'),
							border: `1px solid ${theme('colors.neutral.700')}`,
							borderRadius: '0.5rem',
							overflow: 'auto',
							padding: '1rem',
							margin: '1.5rem 0',
						},
						'pre code': { backgroundColor: 'transparent', color: theme('colors.neutral.100'), padding: '0', whiteSpace: 'pre-wrap' },
						'pre code span': { backgroundColor: 'transparent' },
						a: {
							color: theme('colors.accent-blue'),
							fontWeight: '500',
							textDecoration: 'underline',
							textUnderlineOffset: '2px',
							textDecorationThickness: '1.5px',
							'&:hover': { color: theme('colors.blue.500'), textDecorationThickness: '2px' },
						},
						blockquote: {
							borderLeftColor: theme('colors.accent-blue'),
							borderLeftWidth: '4px',
							paddingLeft: '1.5em',
							marginTop: '1.5em',
							marginBottom: '1.5em',
							fontStyle: 'italic',
							color: theme('colors.gray.700'),
						},
						'blockquote p': { marginTop: '0', marginBottom: '0' },
					},
				},
				lg: {
					css: {
						fontSize: '1.125rem',
						lineHeight: '1.8',
						p: { marginTop: '1.5em', marginBottom: '1.5em' },
					},
				},
				invert: {
					css: {
						color: theme('colors.gray.100'),
						a: {
							color: theme('colors.accent-blue'),
							'&:hover': { color: theme('colors.blue.300') },
						},
						h2: { color: theme('colors.gray.100') },
						h3: { color: theme('colors.gray.100') },
						code: { backgroundColor: theme('colors.neutral.800'), color: theme('colors.neutral.100') },
						pre: { backgroundColor: theme('colors.neutral.900'), borderColor: theme('colors.neutral.700') },
						'pre code': { backgroundColor: 'transparent', color: 'inherit' },
						'pre code span': { backgroundColor: 'transparent' },
						blockquote: { borderLeftColor: theme('colors.accent-blue'), color: theme('colors.gray.300') },
					},
				},
			}),
		},
	},
	plugins: [require('@tailwindcss/typography')],
}

