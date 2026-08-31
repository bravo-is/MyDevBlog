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
