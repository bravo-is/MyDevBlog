# MyDevBlog (Astro)

Internal README for my personal Astro-powered blog/portfolio.

## Project notes
- Astro 7 with Tailwind.
- ViewTransitions and shared fonts come from src/layouts/BaseLayout.astro.
- Header is sticky with a theme toggle; nav links live in src/components/Navigation.astro.

## Local development
- Use Node 22.12+; install deps once with `npm install`.
- Dev server: `npm run dev` (alias `npm start`).
- Production build: `npm run build`; preview a build with `npm run preview`.

## Editing tips
- Landing page copy: src/pages/index.astro.
- Shared layout shell: src/layouts/BaseLayout.astro (fonts, transitions, body classes).
- Components: src/components/ (Header, Hamburger, Navigation, ThemeIcon, Footer).
- Seeing Things entries: src/content/seeing-things/.
- Update nav/social links in src/components/Navigation.astro and src/components/Footer.astro.

## Publishing workflow
- Write and edit posts directly as Markdown in `src/content/posts`.
- Store post images under `public/images/posts` and reference them as `/images/posts/...`.
- Netlify rebuilds the Astro site after GitHub pushes.
- To prepare a post for Substack, run:

```bash
npm run export:substack -- post-1
```

The exporter writes HTML to `substack-export/<post-id>.html` for manual paste/import into Substack.

## Personal TODOs
- Flesh out About, Blog, and Bookshelf pages.
- Continue refining SEO metadata for individual sections and posts.
