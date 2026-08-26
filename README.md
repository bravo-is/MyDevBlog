# MyDevBlog (Astro)

Internal README for my personal Astro-powered blog/portfolio.

## Project notes
- Astro 7 with Tailwind and light React usage (Greeting, ThemeIcon, etc.)
- ViewTransitions and shared fonts come from src/layouts/BaseLayout.astro.
- Header is sticky with a theme toggle; nav links live in src/components/Navigation.astro.

## Local development
- Use Node 20+; install deps once with `npm install`.
- Dev server: `npm run dev` (alias `npm start`).
- Production build: `npm run build`; preview a build with `npm run preview`.

## Editing tips
- Landing page copy and greeting list: src/pages/index.astro.
- Shared layout shell: src/layouts/BaseLayout.astro (fonts, transitions, body classes).
- Components: src/components/ (Header, Hamburger, Navigation, ThemeIcon, Greeting, Footer).
- Update nav/social links in src/components/Navigation.astro and src/components/Footer.astro.

## Publishing workflow
- Write and edit posts in Decap CMS at `/admin/`.
- Decap stores posts as Markdown in `src/content/posts` and commits changes to GitHub.
- Netlify rebuilds the Astro site after CMS commits.
- Uploaded CMS media is stored in `public/uploads` and referenced as `/uploads/...`.
- To prepare a post for Substack, run:

```bash
npm run export:substack -- post-1
```

The exporter writes HTML to `substack-export/<post-id>.html` for manual paste/import into Substack.

## CMS setup
- Decap is configured in `public/admin/config.yml`.
- The CMS uses the GitHub backend for `bravo-is/MyDevBlog` on `main`.
- Configure Netlify OAuth for the GitHub backend before using `/admin` in production.
- For local CMS testing, run Decap's local backend server separately, then start Astro and visit `/admin/`.

## Personal TODOs
- Flesh out About, Blog, and Bookshelf pages.
- Set package.json name/metadata and add basic SEO tags.
- Decide on a color palette (current reference: https://coolors.co/palette/8ecae6-219ebc-023047-ffb703-fb8500).
- Wire up deployment target (Netlify/Vercel) once content is ready.
