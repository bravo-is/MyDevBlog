import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";

import react from "@astrojs/react";

const site = process.env.DEPLOY_PRIME_URL ?? process.env.URL ?? "https://israelbravo.com";

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), react()],
  site
});