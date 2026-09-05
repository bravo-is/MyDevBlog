#!/usr/bin/env node
/**
 * Fetch and cache Hardcover bookshelf data without relying on Vite-specific imports.
 * This script reads raw .gql files directly and writes a JSON cache.
 *
 * Usage:
 *   npm run update:bookshelf
 */

import fs from 'node:fs';
import path from 'node:path';
import { fetchBookshelfData, withTimestamp } from '../src/lib/bookshelf';

async function main() {
  try {
    console.log('Fetching bookshelf data from Hardcover API...');

    const token = process.env.HARDCOVER_API_TOKEN || process.env.VITE_HARDCOVER_API_TOKEN;
    if (!token) throw new Error('Missing or invalid HARDCOVER_API_TOKEN environment variable.');

    const data = await fetchBookshelfData(token);
    const cacheFile = path.join(process.cwd(), 'src/lib/bookshelf.cache.json');
    fs.writeFileSync(cacheFile, JSON.stringify(withTimestamp(data), null, 2));

    console.log(`Bookshelf cache updated: ${cacheFile}`);
    console.log(`Currently reading: ${data.currentlyReading.length}`);
    console.log(`Read: ${data.read.length}`);
    console.log(
      `Metadata: ${data.currentlyReading.filter((book) => book.dateAdded).length} added dates, ` +
      `${data.read.filter((book) => book.finishedAt).length} finished dates, ` +
      `${data.read.filter((book) => book.rating != null).length} ratings`,
    );
    process.exit(0);
  } catch (error) {
    console.error('Error fetching bookshelf data:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

main();
