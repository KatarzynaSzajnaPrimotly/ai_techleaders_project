const DATE_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = { dateStyle: "long", timeStyle: "short" };

export function formatInstant(value: Date | string, timeZone = "UTC"): string {
  const date = value instanceof Date ? value : new Date(value);
  return new Intl.DateTimeFormat("en", { ...DATE_FORMAT_OPTIONS, timeZone }).format(date);
}
