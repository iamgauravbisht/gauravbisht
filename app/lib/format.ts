export function formatDate(
  date: string,
  options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    year: "numeric",
  },
) {
  return new Date(date).toLocaleDateString("en-US", options);
}
