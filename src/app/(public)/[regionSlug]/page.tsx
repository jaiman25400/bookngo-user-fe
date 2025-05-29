import { fetchRegionResorts } from "./regionApi";
import { Suspense } from "react";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import Image from "next/image";
import Link from "next/link";

type Props = {
  params: Promise<{
    regionSlug: string;
  }>;
};

export default async function RegionPage({ params }: Props) {
  const { regionSlug } = await params;

  console.log('region slug ',regionSlug)
  const regionName = regionSlug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  const { data, error } = await fetchRegionResorts(regionName);

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-red-500 text-lg font-medium">
          Error loading resorts: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">
        {regionName} Resorts
      </h1>

      <Suspense fallback={<LoadingSkeleton />}>
        {data?.count === 0 ? (
          <p className="text-gray-600 text-lg">
            No resorts found in {regionName}.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {data?.results?.map((resort) => (
              <div
                key={resort.id}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden"
              >
                <div className="relative aspect-video bg-gray-100">
                  {resort.home_image_url ? (
                    <Image
                      src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${resort.home_image_url}`}
                      alt={resort.customer_display_name || "Resort image"}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      loading="lazy"
                      quality={80}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                      No image available
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="text-xl font-semibold text-gray-800 mb-1 truncate">
                    {resort.customer_display_name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {resort.customer_city}
                  </p>
                </div>
                <Link
                  href={`/vendor/${resort.customer_slug}`} // Make sure you get a unique customerSlug from data
                  className="inline-block mt-3 text-blue-600 hover:underline text-sm font-medium"
                >
                  More Info →
                </Link>
              </div>
            ))}
          </div>
        )}
      </Suspense>
    </div>
  );
}
