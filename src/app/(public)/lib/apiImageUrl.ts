/**
 * Build full URL for images served from the backend.
 * Encodes the path so filenames with spaces (e.g. "Skating joy in holiday lights.png") work.
 */
export function apiImageUrl(path: string | null | undefined): string | null {
  if (!path?.trim()) return null;
  const base = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!base) return null;
  const baseTrimmed = base.replace(/\/$/, "");
  const pathPart = path.startsWith("/") ? path : `/${path}`;
  return `${baseTrimmed}${encodeURI(pathPart)}`;
}
