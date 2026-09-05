import type { Config } from '@netlify/functions';
import { fetchBookshelfData, withTimestamp } from '../../src/lib/bookshelf';
import { setStoredBookshelfData } from '../../src/lib/bookshelf-store';

export default async () => {
  const token = process.env.HARDCOVER_API_TOKEN;
  if (!token) {
    throw new Error('Missing HARDCOVER_API_TOKEN environment variable.');
  }

  const data = withTimestamp(await fetchBookshelfData(token));
  await setStoredBookshelfData(data);

  console.log(
    `Bookshelf blob updated: ${data.currentlyReading.length} currently reading, ${data.read.length} read.`,
  );
  console.log(
    `Metadata: ${data.currentlyReading.filter((book) => book.dateAdded).length} added dates, ` +
    `${data.read.filter((book) => book.finishedAt).length} finished dates, ` +
    `${data.read.filter((book) => book.rating != null).length} ratings`,
  );
};

export const config: Config = {
  schedule: '@daily',
};
