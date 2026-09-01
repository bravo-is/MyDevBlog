import type { ImageMetadata } from 'astro';
import windowReflection from '../assets/seen/window-reflection.jpg';
import parallelRoad from '../assets/seen/tokyo-parallel-road.jpg';

export type SeeingThing = {
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

export const seeingThings: SeeingThing[] = [
  {
    title: 'Stop and Reflect',
    image: windowReflection,
    alt: 'A reflected self portrait in a window with books and city light visible through the glass.',
    location: 'Tokyo',
    note: '"the soul lives"',
    paragraphs: [
      'A bustling city, cars, and hurried people. All of us occupying the same thin plane.',
    ],
    spotifyTrack: {
      url: 'https://open.spotify.com/track/0ESOl0wcHFigdEWnhbAeek?si=d9dc98824b004d54',
      title: 'Spotify track for Pause and Reflect',
    },
  },
  {
    title: 'Parallels',
    image: parallelRoad,
    alt: 'Parallel roads in Tokyo with cars and buildings.',
    location: 'Tokyo',
    note: '',
    paragraphs: [
      '',
    ],
    spotifyTrack: {
      url: 'https://open.spotify.com/track/44vJetDdcFOhZhgpk69P41?si=e1b0642c680c4991',
      title: 'Spotify track for Parallels',
    },
  },
];
