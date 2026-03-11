import { apiImageUrl } from "../../lib/apiImageUrl";
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

const REGION_HERO_IMAGES: Record<string, string> = {
  Ontario:
    "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1600&q=80",
  Quebec:
    "https://images.unsplash.com/photo-1503435980610-a51f3ddfee50?auto=format&fit=crop&w=1600&q=80",
  "British-Columbia":
    "https://images.unsplash.com/photo-1508261306211-45a1c5c2a5c5?auto=format&fit=crop&w=1600&q=80",
  Mnitoba:
    "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1600&q=80",
  "New-Brunswick":
    "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1600&q=80",
  "Nova-Scotia":
    "https://images.unsplash.com/photo-1521185496955-15097b20c5fe?auto=format&fit=crop&w=1600&q=80",
};

function mapToListingItems(venues: SkatingRegionVenue[]): RegionListingItem[] {
  return venues.map((v) => ({
    id: v.id,
    name: v.customer_display_name || "Unnamed Venue",
    slug: v.customer_slug,
    city: v.customer_city || "",
    imageUrl: apiImageUrl(v.home_image_url),
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
  const heroImageUrl = REGION_HERO_IMAGES[regionSlug] ?? null;

  return (
    <RegionListing
      results={items}
      regionName={regionName}
      activityLabel="Ice Skating"
      itemLabel="venue"
      itemLabelPlural="rings"
      basePath="/skates"
      emptyMessage="Try adjusting your search or filters to find skating rings in this region."
      heroImageUrl={heroImageUrl}
    />
  );
}
