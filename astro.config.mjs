import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify';
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  adapter: netlify({
    devFeatures: {
      environmentVariables: false,
      edgeFunctions: false,
      images: true,
    },
  }),
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
  },
  site: "https://israelbravo.com"
});
