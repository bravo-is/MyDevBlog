import { getStoredBookshelfData } from './bookshelf-store';
import cachedBookshelf from './bookshelf.cache.json';
import type { BookshelfData, CachedBookshelfData } from './bookshelf';
export type { BookshelfData, BookshelfItem } from './bookshelf';

const getCachedBookshelfData = (): CachedBookshelfData | null => {
  return cachedBookshelf;
};

const timestampValue = (value: string | undefined) => {
  if (!value) {
    return null;
  }

  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp) ? timestamp : null;
};

export const getBookshelfData = async (): Promise<BookshelfData> => {
  const stored = await getStoredBookshelfData();
  const cached = getCachedBookshelfData();

  if (stored && cached) {
    const storedTimestamp = timestampValue(stored.lastUpdated);
    const cachedTimestamp = timestampValue(cached.lastUpdated);

    if (storedTimestamp !== null && cachedTimestamp !== null && storedTimestamp > cachedTimestamp) {
      return stored;
    }

    return cached;
  }

  if (stored) {
    return stored;
  }

  if (cached) {
    return cached;
  }

  return {
    currentlyReading: [],
    read: [],
    error: 'Bookshelf data is unavailable.',
  };
};
