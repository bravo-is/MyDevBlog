# MyDevBlog (Astro)

Internal README for my personal Astro-powered blog/portfolio.

## Project notes
- Astro 5 with Tailwind and light React usage (Greeting, ThemeIcon, etc.)
- ViewTransitions and shared fonts come from src/layouts/BaseLayout.astro.
- Header is sticky with a theme toggle; nav links live in src/components/Navigation.astro.
- Assets live in public/ (self.JPEG, hardcover.png); global styles are in src/styles/global.css.

## Local development
- Use Node 20+; install deps once with `npm install`.
- Dev server: `npm run dev` (alias `npm start`).
- Production build: `npm run build`; preview a build with `npm run preview`.

## Editing tips
- Landing page copy and greeting list: src/pages/index.astro.
- Shared layout shell: src/layouts/BaseLayout.astro (fonts, transitions, body classes).
- Components: src/components/ (Header, Hamburger, Navigation, ThemeIcon, Greeting, Footer).
- Update nav/social links in src/components/Navigation.astro and src/components/Footer.astro.

## Personal TODOs
- Flesh out About, Blog, and Bookshelf pages.
- Set package.json name/metadata and add basic SEO tags.
- Decide on a color palette (current reference: https://coolors.co/palette/8ecae6-219ebc-023047-ffb703-fb8500).
- Wire up deployment target (Netlify/Vercel) once content is ready.
