const postDateFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
  timeZone: "UTC",
});

export const formatPostDate = (date: Date) => postDateFormatter.format(date);

export const formatShortPostDate = (date: Date) =>
  date.toISOString().slice(0, 10);

export const postDateTime = (date: Date) => formatShortPostDate(date);

export const formatBookDate = (date: string) =>
  postDateFormatter.format(new Date(`${date}T00:00:00.000Z`));
