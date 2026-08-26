import { getStore } from '@netlify/blobs';
import type { CachedBookshelfData } from './bookshelf';

const STORE_NAME = 'bookshelf';
const CACHE_KEY = 'latest.json';

export const getStoredBookshelfData = async (): Promise<CachedBookshelfData | null> => {
  try {
    const store = getStore({
      name: STORE_NAME,
      consistency: 'strong',
    });

    return await store.get(CACHE_KEY, {
      consistency: 'strong',
      type: 'json',
    }) as CachedBookshelfData | null;
  } catch {
    return null;
  }
};

export const setStoredBookshelfData = async (data: CachedBookshelfData) => {
  const store = getStore({
    name: STORE_NAME,
    consistency: 'strong',
  });

  await store.setJSON(CACHE_KEY, data);
};
