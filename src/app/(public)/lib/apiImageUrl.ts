/**
 * Build full URL for images from the API.
 * - Relative paths (`/uploads/...`) are prefixed with NEXT_PUBLIC_API_BASE_URL and encoded.
 * - Absolute URLs (e.g. S3 presigned `https://...amazonaws.com/...?...`) are returned unchanged
 *   so signatures are not broken and next/image can load them (see remotePatterns).
 */
export function apiImageUrl(path: string | null | undefined): string | null {
  if (!path?.trim()) return null;
  const trimmed = path.trim();

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  const base = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!base) return null;
  const baseTrimmed = base.replace(/\/$/, "");
  const pathPart = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  return `${baseTrimmed}${encodeURI(pathPart)}`;
}
