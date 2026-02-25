import userBooksWithMeQuery from './queries/userBooksWithMe.gql?raw';

type HardcoverImage = {
  url?: string | null;
};

type HardcoverBook = {
  id?: number | null;
  title?: string | null;
  slug?: string | null;
  image?: HardcoverImage | null;
};

type HardcoverUserBook = {
  id: number;
  book?: HardcoverBook | null;
  status_id: number;
};

type HardcoverResponse<TData> = {
  data?: TData;
  errors?: { message: string }[];
};

export type BookshelfItem = {
  id: number;
  title: string;
  coverUrl: string | null;
  bookUrl: string;
};

export type BookshelfData = {
  currentlyReading: BookshelfItem[];
  read: BookshelfItem[];
  error?: string;
};


type UserBooksData = {
  user_books?: HardcoverUserBook[];
};

type UserWithBooks = {
  id?: number | null;
  username?: string | null;
  user_books?: HardcoverUserBook[];
};

type CombinedResponse = {
  me?: UserWithBooks[] | null;
};

const fetchHardcover = async <TData>(query: string, variables: Record<string, unknown>) => {
  const authToken = import.meta.env.HARDCOVER_API_TOKEN;
  if (!authToken) {
    throw new Error('Hardcover API token is not configured.');
  }
  const authHeader = authToken.startsWith('Bearer ') ? authToken : `Bearer ${authToken}`;
  const apiUrl = 'https://api.hardcover.app/v1/graphql';

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: authHeader,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    throw new Error(`Hardcover API error: ${response.status} ${response.statusText}`);
  }

  const payload = (await response.json()) as HardcoverResponse<TData>;

  if (payload.errors?.length) {
    throw new Error(payload.errors.map((error) => error.message).join('; '));
  }

  return payload.data;
};

const mapUserBooks = (books: HardcoverUserBook[] | undefined) => {
  if (!books) {
    return [];
  }

  return books.map((entry) => {
    const book = entry.book;
    const title = book?.title?.trim() || 'Untitled';
    const coverUrl = book?.image?.url ?? null;
    const bookUrl = book?.slug 
      ? `https://hardcover.app/books/${book.slug}` 
      : 'https://hardcover.app/home';

    return {
      id: book?.id ?? 0,
      title,
      coverUrl,
      bookUrl,
    } satisfies BookshelfItem;
  });
};

const isCurrentlyReading = (status_id: HardcoverUserBook['status_id']) =>
  status_id === 2;

const isRead = (status_id: HardcoverUserBook['status_id']) =>
  status_id === 3;


const getCachedBookshelfData = (): BookshelfData | null => {
  try {
    // Import cache file
    const cache = import.meta.glob<{ default: BookshelfData }>(
      '../lib/bookshelf.cache.json',
      { eager: true }
    )['../lib/bookshelf.cache.json'];
    return cache?.default ?? null;
  } catch {
    return null;
  }
};

export const getBookshelfData = async (): Promise<BookshelfData> => {
  const token = import.meta.env.HARDCOVER_API_TOKEN?.trim();

  if (!token) {
    const cached = getCachedBookshelfData();
    if (cached) {
      return {
        ...cached,
        error: 'Using cached data. Missing Hardcover API configuration.',
      };
    }
    return {
      currentlyReading: [],
      read: [],
      error: 'Missing Hardcover API configuration. Set HARDCOVER_API_TOKEN.',
    };
  }

  try {
    const data = await fetchHardcover<CombinedResponse>(userBooksWithMeQuery, {});
    const user = data?.me?.[0];
    
    if (!user?.id) {
      const cached = getCachedBookshelfData();
      if (cached) {
        return {
          ...cached,
          error: 'Unable to resolve Hardcover user ID. Using cached data.',
        };
      }
      return {
        currentlyReading: [],
        read: [],
        error: 'Unable to resolve your Hardcover user id from the API response.',
      };
    }

    const userBooks = user.user_books ?? [];

    return {
      currentlyReading: mapUserBooks(userBooks.filter((entry) => isCurrentlyReading(entry.status_id))),
      read: mapUserBooks(userBooks.filter((entry) => isRead(entry.status_id))),
    };
  } catch (error) {
    // Fall back to cached data on API error
    const cached = getCachedBookshelfData();
    if (cached) {
      return {
        ...cached,
        error: `Using cached data (${error instanceof Error ? error.message : 'API error'}).`,
      };
    }
    return {
      currentlyReading: [],
      read: [],
      error: error instanceof Error ? error.message : 'Unable to load Hardcover data.',
    };
  }
};
