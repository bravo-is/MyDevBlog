#!/usr/bin/env node
/**
 * Fetch and cache Hardcover bookshelf data without relying on Vite-specific imports.
 * This script reads raw .gql files directly and writes a JSON cache.
 *
 * Usage:
 *   npm run update:bookshelf
 *   # or
 *   npx tsx scripts/update-bookshelf.ts
 */

import fs from 'fs';
import path from 'path';

type HardcoverImage = { url?: string | null };
type HardcoverBook = { id?: number | null; title?: string | null; slug?: string | null; image?: HardcoverImage | null };
type HardcoverUserBook = { id: number; book?: HardcoverBook | null; status_id: number };
type HardcoverResponse<TData> = { data?: TData; errors?: { message: string }[] };
type BookshelfItem = { id: number; title: string; coverUrl: string | null; bookUrl: string | null };
type BookshelfData = { currentlyReading: BookshelfItem[]; read: BookshelfItem[] };
type CachedBookshelfData = BookshelfData & { lastUpdated: string };

type UserWithBooks = { id?: number | null; username?: string | null; user_books?: HardcoverUserBook[] };
type CombinedResponse = { me?: UserWithBooks[] | null };

const readQuery = (rel: string) => fs.readFileSync(path.join(process.cwd(), rel), 'utf-8');

const fetchHardcover = async <TData>(query: string, variables: Record<string, unknown>) => {
  const token = process.env.HARDCOVER_API_TOKEN || process.env.VITE_HARDCOVER_API_TOKEN;
  if (!token || typeof token !== 'string' || token.trim() === '') {
    throw new Error('Missing or invalid HARDCOVER_API_TOKEN environment variable.');
  }
  const authHeader = token.startsWith('Bearer ') ? token : `Bearer ${token}`;

  const apiUrl = 'https://api.hardcover.app/v1/graphql';
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: authHeader },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) throw new Error(`Hardcover API error: ${response.status} ${response.statusText}`);
  const payload = (await response.json()) as HardcoverResponse<TData>;
  if (payload.errors?.length) throw new Error(payload.errors.map((e) => e.message).join('; '));
  return payload.data;
};

const mapUserBooks = (books: HardcoverUserBook[] | undefined): BookshelfItem[] => {
  if (!books) return [];
  return books.map((entry) => {
    const book = entry.book;
    const title = book?.title?.trim() || 'Untitled';
    const coverUrl = book?.image?.url ?? null;
    const bookUrl = book?.slug ? `https://hardcover.app/books/${book.slug}` : null;
    return { id: book?.id ?? 0, title, coverUrl, bookUrl };
  });
};

const isCurrentlyReading = (status_id: HardcoverUserBook['status_id']) => status_id === 2;
const isRead = (status_id: HardcoverUserBook['status_id']) => status_id === 3;

async function main() {
  try {
    console.log('📚 Fetching bookshelf data from Hardcover API...');

    // Read combined query from .gql file
    const userBooksWithMeQuery = readQuery('src/lib/queries/userBooksWithMe.gql');

    const responseData = await fetchHardcover<CombinedResponse>(userBooksWithMeQuery, {});
    const user = responseData?.me?.[0];
    if (!user?.id) throw new Error('Unable to resolve Hardcover user id from the API response.');

    const userBooks = user.user_books ?? [];

    const data: BookshelfData = {
      currentlyReading: mapUserBooks(userBooks.filter((entry) => isCurrentlyReading(entry.status_id))),
      read: mapUserBooks(userBooks.filter((entry) => isRead(entry.status_id))),
    };

    const cacheFile = path.join(process.cwd(), 'src/lib/bookshelf.cache.json');
    const cacheData: CachedBookshelfData = { ...data, lastUpdated: new Date().toISOString() };
    fs.writeFileSync(cacheFile, JSON.stringify(cacheData, null, 2));

    console.log(`✅ Bookshelf cache updated: ${cacheFile}`);
    console.log(`📖 Currently reading: ${data.currentlyReading.length}`);
    console.log(`📕 Read: ${data.read.length}`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error fetching bookshelf data:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

main();
