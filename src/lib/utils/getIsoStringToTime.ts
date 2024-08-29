export function isoStringToTime(value: string | null): [number, number] | null {
  if (value == null) {
    return null;
  }
  const date = new Date(value);
  return [date.getHours(), date.getMinutes()];
}
