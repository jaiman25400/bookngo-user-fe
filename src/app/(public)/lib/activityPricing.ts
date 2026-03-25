/**
 * Activity base_price from API is typically a decimal string (e.g. "0", "10.00").
 * Free public activities (rentals sold separately) use price 0.
 */
export function parseActivityBasePrice(value: unknown): number {
  if (value === null || value === undefined) return NaN;
  const raw = String(value).trim();
  if (!raw) return NaN;
  const n = Number.parseFloat(raw.replace(/[^0-9.-]/g, ""));
  return Number.isFinite(n) ? n : NaN;
}

/** True when activity admission is free (price is 0); false if price missing or invalid (treat as paid). */
export function isFreeAdmissionActivity(basePrice: unknown): boolean {
  const n = parseActivityBasePrice(basePrice);
  return Number.isFinite(n) && n <= 0;
}

export function formatActivityPriceDisplay(basePrice: unknown): string {
  const n = parseActivityBasePrice(basePrice);
  if (!Number.isFinite(n)) return "—";
  if (n <= 0) return "Free";
  return `$${n.toFixed(2)}`;
}
