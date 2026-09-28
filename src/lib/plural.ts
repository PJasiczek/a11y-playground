/**
 * A count with the right Polish noun form: 1 przykład, 2–4 przykłady, 5+ przykładów, and the
 * last form again for 12–14 and 0. Pass the three forms in that order.
 */
export function countOf(n: number, [one, few, many]: readonly [string, string, string]) {
  const tens = n % 100;
  const ones = n % 10;
  if (n === 1) return `1 ${one}`;
  if (ones >= 2 && ones <= 4 && (tens < 12 || tens > 14)) return `${String(n)} ${few}`;
  return `${String(n)} ${many}`;
}
