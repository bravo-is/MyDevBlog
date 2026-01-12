import booksQuery from './queries/books.gql?raw';
import currentUserQuery from './queries/currentUser.gql?raw';

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
  bookUrl: string | null;
};

export type BookshelfData = {
  currentlyReading: BookshelfItem[];
  read: BookshelfItem[];
  error?: string;
};


type UserBooksData = {
  user_books?: HardcoverUserBook[];
};

type User = {
  id?: number | null;
  username?: string | null;
};

type CurrentUserResponse = {
  me?: User[] | null;
};

const fetchHardcover = async <TData>(query: string, variables: Record<string, unknown>) => {
  const authToken = import.meta.env.HARDCOVER_API_TOKEN;
  const apiUrl = 'https://api.hardcover.app/v1/graphql';

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${authToken}`,
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
    const bookUrl = book?.slug ? `https://hardcover.app/books/${book.slug}` : null;

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


export const getBookshelfData = async (): Promise<BookshelfData> => {
  const token = import.meta.env.HARDCOVER_API_TOKEN;

  if (!token) {
    return {
      currentlyReading: [],
      read: [],
      error: 'Missing Hardcover API configuration. Set HARDCOVER_API_TOKEN.',
    };
  }

  try {
    const userData = await fetchHardcover<CurrentUserResponse>(currentUserQuery, {});
    const userIdNumber = userData?.me?.[0]?.id ?? null;

    if (!userIdNumber) {
      return {
        currentlyReading: [],
        read: [],
        error: 'Unable to resolve your Hardcover user id from the API response.',
      };
    }

    const booksData = await fetchHardcover<UserBooksData>(booksQuery, {
      userId: userIdNumber,
    });
    const userBooks = booksData?.user_books ?? [];

    return {
      currentlyReading: mapUserBooks(userBooks.filter((entry) => isCurrentlyReading(entry.status_id))),
      read: mapUserBooks(userBooks.filter((entry) => isRead(entry.status_id))),
    };
  } catch (error) {
    return {
      currentlyReading: [],
      read: [],
      error: error instanceof Error ? error.message : 'Unable to load Hardcover data.',
    };
  }
};
