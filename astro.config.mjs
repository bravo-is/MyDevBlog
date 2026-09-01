import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify';
import tailwindcss from "@tailwindcss/vite";

const isDevCommand = process.argv.includes('dev');

// https://astro.build/config
export default defineConfig({
  ...(isDevCommand ? {} : { adapter: netlify() }),
  vite: {
    plugins: [tailwindcss()],
  },
  site: "https://israelbravo.com"
});
