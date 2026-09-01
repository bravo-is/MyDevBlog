import type { ImageMetadata } from 'astro';
import windowReflection from '../assets/seen/window-reflection.jpg';

export type SeenThing = {
  title: string;
  image: ImageMetadata;
  alt: string;
  location?: string;
  note?: string;
  paragraphs?: string[];
  spotifyTrack?: {
    url: string;
    title: string;
  };
};

export const seenThings: SeenThing[] = [
  {
    title: 'Stop and Reflect',
    image: windowReflection,
    alt: 'A reflected self portrait in a window with books and city light visible through the glass.',
    location: 'Tokyo',
    note: '"The soul lives"',
    paragraphs: [
      'A bustling city, cars, and hurried people. All of us occupying the same thin plane.',
    ],
    spotifyTrack: {
      url: 'https://open.spotify.com/track/0ESOl0wcHFigdEWnhbAeek?si=d9dc98824b004d54',
      title: 'Spotify track for Pause and Reflect',
    },
  },
];
