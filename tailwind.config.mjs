/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],  
	safelist: [
		'bg-neutral-200',
		'bg-neutral-300',
		'bg-neutral-400',
		'bg-neutral-500',
		'bg-neutral-600',
		'bg-neutral-700',
		'bg-neutral-800',
		'bg-neutral-900',
	  ],
	darkMode: "class",
	theme: {
		extend: {},
	},
	plugins: [],
}
