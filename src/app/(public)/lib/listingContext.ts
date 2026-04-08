/**
 * Listing context for vendor → "back to list" UX.
 * Use ?from=skates | ?from=skiing on vendor/activity URLs — never infer from vendor name.
 */

export const LISTING_FROM_PARAM = "from" as const;

export type ListingFrom = "skates" | "skiing";

export function isListingFrom(v: string | undefined | null): v is ListingFrom {
  return v === "skates" || v === "skiing";
}

/** Parse Next.js searchParams `from` value */
export function parseListingFromParam(
  value: string | string[] | undefined
): ListingFrom | null {
  const raw = Array.isArray(value) ? value[0] : value;
  return isListingFrom(raw) ? raw : null;
}

/** Append ?from=… to a path (handles existing query string). */
export function withListingFrom(
  path: string,
  from: ListingFrom | null
): string {
  if (!from) return path;
  const sep = path.includes("?") ? "&" : "?";
  return `${path}${sep}${LISTING_FROM_PARAM}=${from}`;
}

export function vendorPath(slug: string, from: ListingFrom | null): string {
  return withListingFrom(`/vendor/${slug}`, from);
}

export function activityPath(
  slug: string,
  activityId: string | number,
  from: ListingFrom | null
): string {
  return withListingFrom(`/vendor/${slug}/activities/${activityId}`, from);
}

export function bookingPath(
  slug: string,
  activityId: string | number,
  from: ListingFrom | null
): string {
  return withListingFrom(
    `/vendor/${slug}/activities/${activityId}/book`,
    from
  );
}

export function listingParent(from: ListingFrom): { href: string; label: string } {
  if (from === "skates") {
    return { href: "/skates", label: "Skating Rinks" };
  }
  return { href: "/skiing", label: "Ski Slopes" };
}

/** Infer from Referer pathname (same-site navigation when ?from is missing). */
export function inferListingFromReferer(referer: string | null): ListingFrom | null {
  if (!referer?.trim()) return null;
  try {
    const u = new URL(referer);
    const p = u.pathname;
    if (p === "/skates" || p.startsWith("/skates/")) return "skates";
    if (p === "/skiing" || p.startsWith("/skiing/")) return "skiing";
  } catch {
    /* ignore */
  }
  return null;
}

/**
 * Resolve listing context: explicit query wins, then Referer, then default.
 * Default is skiing for direct/organic visits without context.
 */
export function resolveListingFrom(
  fromParam: string | string[] | undefined,
  referer: string | null
): ListingFrom {
  return (
    parseListingFromParam(fromParam) ??
    inferListingFromReferer(referer) ??
    "skiing"
  );
}
