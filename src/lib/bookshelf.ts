export type HardcoverImage = {
  url?: string | null;
};

export type HardcoverBook = {
  id?: number | null;
  title?: string | null;
  slug?: string | null;
  image?: HardcoverImage | null;
};

export type HardcoverUserBook = {
  id?: number;
  book?: HardcoverBook | null;
  status_id: number;
  date_added?: string | null;
  last_read_date?: string | null;
  rating?: number | string | null;
  user_book_reads?: {
    started_at?: string | null;
    finished_at?: string | null;
  }[];
};

export type HardcoverResponse<TData> = {
  data?: TData;
  errors?: { message: string }[];
};

export type BookshelfItem = {
  id: number;
  title: string;
  coverUrl: string | null;
  bookUrl: string;
  dateAdded?: string | null;
  finishedAt?: string | null;
  rating?: number | null;
};

export type BookshelfData = {
  currentlyReading: BookshelfItem[];
  read: BookshelfItem[];
  error?: string;
};

export type CachedBookshelfData = BookshelfData & {
  lastUpdated: string;
};

type UserWithBooks = {
  id?: number | null;
  username?: string | null;
  user_books?: HardcoverUserBook[];
};

type CombinedResponse = {
  me?: UserWithBooks[] | null;
};

const userBooksWithMeQuery = `
query UserBooksWithMe {
  me {
    id
    user_books(
      distinct_on: book_id
      limit: 200
      offset: 0
    ) {
      id
      status_id
      date_added
      last_read_date
      rating
      user_book_reads(
        order_by: { finished_at: desc_nulls_last }
        limit: 1
      ) {
        started_at
        finished_at
      }
      book {
        id
        title
        slug
        image {
          url
        }
      }
    }
  }
}
`;

const fetchHardcover = async <TData>(
  query: string,
  variables: Record<string, unknown>,
  token: string,
) => {
  const authToken = token.trim();
  if (!authToken) {
    throw new Error('Missing or invalid HARDCOVER_API_TOKEN environment variable.');
  }

  const authHeader = authToken.startsWith('Bearer ') ? authToken : `Bearer ${authToken}`;
  const response = await fetch('https://api.hardcover.app/v1/graphql', {
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

const mapUserBooks = (books: HardcoverUserBook[] | undefined): BookshelfItem[] => {
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
    const rating = entry.rating === null || entry.rating === undefined ? null : Number(entry.rating);
    const latestFinishedAt = entry.user_book_reads?.find((read) => read.finished_at)?.finished_at ?? null;

    return {
      id: book?.id ?? 0,
      title,
      coverUrl,
      bookUrl,
      dateAdded: entry.date_added ?? null,
      finishedAt: entry.last_read_date ?? latestFinishedAt,
      rating: Number.isFinite(rating) ? rating : null,
    };
  });
};

const isCurrentlyReading = (status_id: HardcoverUserBook['status_id']) => status_id === 2;

const isRead = (status_id: HardcoverUserBook['status_id']) => status_id === 3;

export const fetchBookshelfData = async (token: string): Promise<BookshelfData> => {
  const data = await fetchHardcover<CombinedResponse>(userBooksWithMeQuery, {}, token);
  const user = data?.me?.[0];

  if (!user?.id) {
    throw new Error('Unable to resolve Hardcover user id from the API response.');
  }

  const userBooks = user.user_books ?? [];

  return {
    currentlyReading: mapUserBooks(userBooks.filter((entry) => isCurrentlyReading(entry.status_id))),
    read: mapUserBooks(userBooks.filter((entry) => isRead(entry.status_id))),
  };
};

export const withTimestamp = (data: BookshelfData): CachedBookshelfData => ({
  ...data,
  lastUpdated: new Date().toISOString(),
});
