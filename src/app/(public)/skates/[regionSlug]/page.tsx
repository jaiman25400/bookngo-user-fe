import { fetchSkatingByRegion, type SkatingRegionVenue } from "../skatingApi";
import { notFound } from "next/navigation";
import RegionListing, { type RegionListingItem } from "@/components/RegionListing";

type Props = {
  params: Promise<{ regionSlug: string }>;
};

function formatRegionName(slug: string): string {
  return slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function mapToListingItems(venues: SkatingRegionVenue[]): RegionListingItem[] {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  return venues.map((v) => ({
    id: v.id,
    name: v.customer_display_name || "Unnamed Venue",
    slug: v.customer_slug,
    city: v.customer_city || "",
    imageUrl: v.home_image_url ? `${base}${v.home_image_url}` : null,
  }));
}

export default async function SkatingRegionPage({ params }: Props) {
  let regionSlug: string;
  let regionName: string;

  try {
    const resolved = await params;
    regionSlug = resolved.regionSlug;
    regionName = formatRegionName(regionSlug);
  } catch {
    notFound();
  }

  const { data, error } = await fetchSkatingByRegion(regionName);

  if (error || !data || data.count === 0 || !data.results?.length) {
    notFound();
  }

  const items = mapToListingItems(data.results);

  return (
    <RegionListing
      results={items}
      regionName={regionName}
      activityLabel="Ice Skating"
      itemLabel="venue"
      itemLabelPlural="rinks"
      basePath="/skates"
      emptyMessage="Try adjusting your search or filters to find rinks in this region."
    />
  );
}
