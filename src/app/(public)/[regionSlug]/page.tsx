import { apiImageUrl } from "../lib/apiImageUrl";
import { fetchRegionResorts, type Resort } from "./regionApi";
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
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80",
  Manitoba:
    "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1600&q=80",
  "New-Brunswick":
    "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1600&q=80",
  "Nova-Scotia":
    "https://images.unsplash.com/photo-1521185496955-15097b20c5fe?auto=format&fit=crop&w=1600&q=80",
};

function mapToListingItems(resorts: Resort[]): RegionListingItem[] {
  return resorts.map((r) => ({
    id: r.id,
    name: r.customer_display_name || "Unnamed Resort",
    slug: r.customer_slug,
    city: r.customer_city || "",
    imageUrl: apiImageUrl(r.home_image_url),
  }));
}

export default async function RegionPage({ params }: Props) {
  let regionSlug: string;
  let regionName: string;

  try {
    const resolvedParams = await params;
    regionSlug = resolvedParams.regionSlug;
    regionName = formatRegionName(regionSlug);
  } catch {
    notFound();
  }

  const { data, error } = await fetchRegionResorts(regionName);

  if (error || !data || data.count === 0 || !data.results?.length) {
    notFound();
  }

  const items = mapToListingItems(data.results);
  const heroImageUrl = REGION_HERO_IMAGES[regionSlug] ?? null;

  return (
    <RegionListing
      results={items}
      regionName={regionName}
      activityLabel="Skiing"
      itemLabel="resort"
      itemLabelPlural="resorts"
      basePath="/skiing"
      listingFrom="skiing"
      emptyMessage="Try adjusting your search or filters to find resorts in this region."
      heroImageUrl={heroImageUrl}
    />
  );
}
