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

function mapToListingItems(resorts: Resort[]): RegionListingItem[] {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  return resorts.map((r) => ({
    id: r.id,
    name: r.customer_display_name || "Unnamed Resort",
    slug: r.customer_slug,
    city: r.customer_city || "",
    imageUrl: r.home_image_url ? `${base}${r.home_image_url}` : null,
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

  return (
    <RegionListing
      results={items}
      regionName={regionName}
      activityLabel="Skiing"
      itemLabel="resort"
      itemLabelPlural="resorts"
      basePath="/skiing"
      emptyMessage="Try adjusting your search or filters to find resorts in this region."
    />
  );
}
