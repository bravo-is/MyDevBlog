import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const postsCollection = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/posts" }),
  schema: z.object({
    title: z.string(),
    pubDate: z.coerce.date(),
    description: z.string(),
    author: z.string(),
    image: z.object({
      url: z.string().optional(),
      alt: z.string().optional(),
    }).optional(),
    tags: z.array(z.string()),
  }),
});

const seeingThingsCollection = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/seeing-things" }),
  schema: ({ image }) => z.object({
    title: z.string(),
    sortOrder: z.number(),
    image: image(),
    alt: z.string(),
    location: z.string().optional(),
    note: z.string().optional(),
    spotifyTrack: z.object({
      url: z.string().url(),
      title: z.string(),
    }).optional(),
  }),
});

export const collections = {
  posts: postsCollection,
  seeingThings: seeingThingsCollection,
};
