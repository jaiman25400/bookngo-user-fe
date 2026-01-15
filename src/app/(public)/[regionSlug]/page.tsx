import { fetchRegionResorts, type Resort } from "./regionApi";
import { Suspense } from "react";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FiMapPin, FiArrowRight } from "react-icons/fi";

type Props = {
  params: Promise<{
    regionSlug: string;
  }>;
};

function formatRegionName(slug: string): string {
  return slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function ResortCard({ resort }: { resort: Resort }) {
  const imageUrl = resort.home_image_url
    ? `${process.env.NEXT_PUBLIC_API_BASE_URL}${resort.home_image_url}`
    : null;

  return (
    <Link
      href={`/vendor/${resort.customer_slug}`}
      className="group block bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 h-full flex flex-col"
    >
      {/* Image Container */}
      <div className="relative aspect-[16/10] bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
        {imageUrl ? (
          <>
            <Image
              src={imageUrl}
              alt={resort.customer_display_name || "Resort image"}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              loading="lazy"
              quality={85}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-sky-100 to-blue-100 text-gray-500">
            <FiMapPin className="w-12 h-12 mb-2 opacity-50" />
            <span className="text-sm font-medium">No image available</span>
          </div>
        )}
      </div>

      {/* Content Container */}
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-sky-600 transition-colors">
            {resort.customer_display_name || "Unnamed Resort"}
          </h3>
          {resort.customer_city && (
            <div className="flex items-center text-gray-600 mb-4">
              <FiMapPin className="w-4 h-4 mr-1.5 flex-shrink-0" />
              <span className="text-sm">{resort.customer_city}</span>
            </div>
          )}
        </div>

        {/* CTA Button */}
        <div className="mt-auto pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between text-sky-600 group-hover:text-sky-700 font-medium">
            <span className="text-sm">View Details</span>
            <FiArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </Link>
  );
}

export default async function RegionPage({ params }: Props) {
  let regionSlug: string;
  let regionName: string;

  try {
    const resolvedParams = await params;
    regionSlug = resolvedParams.regionSlug;
    regionName = formatRegionName(regionSlug);
  } catch (error) {
    console.error("Error resolving params:", error);
    notFound();
  }

  const { data, error } = await fetchRegionResorts(regionName);

  // Handle errors or empty results - show not found page
  if (error || !data || data.count === 0 || !data.results || data.results.length === 0) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Header Section */}
        <div className="mb-8 md:mb-12">
          <div className="flex items-center mb-4">
            <Link
              href="/"
              className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium"
            >
              Home
            </Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-gray-900 font-medium">{regionName}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            {regionName} Resorts
          </h1>
          <p className="text-lg text-gray-600">
            Discover {data.count} {data.count === 1 ? 'resort' : 'resorts'} in {regionName}
          </p>
        </div>

        {/* Resorts Grid */}
        <Suspense fallback={<LoadingSkeleton />}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {data.results.map((resort) => (
              <ResortCard key={resort.id} resort={resort} />
            ))}
          </div>
        </Suspense>
      </div>
    </div>
  );
}
