import rss, { pagesGlobToRssItems } from '@astrojs/rss';

export async function GET(context: any) {
  return rss({
    title: 'Israel Bravo | Blog',
    description: 'My journey learning to live wisely and well.',
    site: context.site,
    items: await pagesGlobToRssItems(import.meta.glob('./**/*.md')),
    customData: `<language>en-us</language>`,
  });
}