import { getStoredBookshelfData } from './bookshelf-store';
import cachedBookshelf from './bookshelf.cache.json';
import type { BookshelfData } from './bookshelf';
export type { BookshelfData, BookshelfItem } from './bookshelf';

const getCachedBookshelfData = (): BookshelfData | null => {
  return cachedBookshelf;
};

export const getBookshelfData = async (): Promise<BookshelfData> => {
  const stored = await getStoredBookshelfData();
  if (stored) {
    return stored;
  }

  const cached = getCachedBookshelfData();
  if (cached) {
    return {
      ...cached,
      error: 'Using built-in bookshelf cache. Netlify Blobs data is unavailable.',
    };
  }

  return {
    currentlyReading: [],
    read: [],
    error: 'Bookshelf data is unavailable.',
  };
};
