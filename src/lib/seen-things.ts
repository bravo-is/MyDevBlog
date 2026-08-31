import type { ImageMetadata } from 'astro';
import windowReflection from '../assets/seen/window-reflection.jpg';

export type SeenThing = {
  title: string;
  image: ImageMetadata;
  alt: string;
  location?: string;
  note?: string;
  paragraphs?: string[];
};

export const seenThings: SeenThing[] = [
  {
    title: 'Pause and Reflect',
    image: windowReflection,
    alt: 'A reflected self portrait in a window with books and city light visible through the glass.',
    location: 'Tokyo',
    note: '"the soul lives on"',
    paragraphs: [
      'A layered window photograph: street, shelf, glass, and person all occupying the same thin plane.',
    ],
  },
];
