import Image from "next/image";
import { headers } from "next/headers";
import { apiImageUrl } from "../../lib/apiImageUrl";
import {
  activityPath,
  listingParent,
  resolveListingFrom,
  type ListingFrom,
} from "../../lib/listingContext";
import { fetchVendorDetailByName, type VendorActivity } from "./vendorDetailApi";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  FiMapPin,
  FiArrowRight,
  FiClock,
  FiDollarSign,
  FiInfo,
  FiActivity,
} from "react-icons/fi";

type Props = {
  params: Promise<{
    vendorDetail: string;
  }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

function ActivityCard({
  activity,
  vendorSlug,
  listingFrom,
}: {
  activity: VendorActivity;
  vendorSlug: string;
  listingFrom: ListingFrom;
}) {
  const imageUrl = apiImageUrl(activity.activity_thumbnail_image);

  return (
    <Link
      href={activityPath(vendorSlug, activity.id, listingFrom)}
      className="group block h-full"
      aria-label={`View ${activity.activity_name} activity`}
    >
      <article className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 h-full flex flex-col transform hover:-translate-y-1">
        {/* Image Container */}
        <div className="relative aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
          {imageUrl ? (
            <>
              <Image
                src={imageUrl}
                alt={activity.activity_name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                loading="lazy"
                quality={85}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-sky-100 to-blue-100 text-gray-500">
              <FiActivity className="w-12 h-12 mb-2 opacity-50" />
              <span className="text-sm font-medium">No image available</span>
            </div>
          )}
        </div>

        {/* Content Container */}
        <div className="p-6 flex-1 flex flex-col">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-sky-600 transition-colors">
              {activity.activity_name}
            </h3>

            {activity.activity_description && (
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {activity.activity_description}
              </p>
            )}

            {/* Activity Metadata */}
            <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-4">
              <div className="flex items-center">
                <FiDollarSign className="w-4 h-4 mr-1.5 text-sky-600" />
                <span className="font-semibold text-gray-900">
                  ${parseFloat(activity.base_price).toFixed(2)}
                </span>
              </div>
              {activity.duration_hours && (
                <div className="flex items-center">
                  <FiClock className="w-4 h-4 mr-1.5 text-gray-400" />
                  <span>
                    {typeof activity.duration_hours === "string"
                      ? activity.duration_hours
                      : `${activity.duration_hours}h`}
                  </span>
                </div>
              )}
              {activity.age_group && (
                <div className="flex items-center">
                  <FiInfo className="w-4 h-4 mr-1.5 text-gray-400" />
                  <span>{activity.age_group}</span>
                </div>
              )}
            </div>
          </div>

          {/* CTA */}
          <div className="pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between text-sky-600 group-hover:text-sky-700 font-medium">
              <span className="text-sm">View Details</span>
              <FiArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}

export default async function VendorPage({ params, searchParams }: Props) {
  let vendorDetail: string;

  try {
    const resolvedParams = await params;
    vendorDetail = resolvedParams.vendorDetail;
  } catch (error) {
    console.error("Error resolving params:", error);
    notFound();
  }

  const [resolvedSearch, headersList] = await Promise.all([
    searchParams,
    headers(),
  ]);
  const referer = headersList.get("referer");
  const listingFrom = resolveListingFrom(resolvedSearch.from, referer);
  const { href: parentHref, label: parentLabel } = listingParent(listingFrom);

  const { data, error } = await fetchVendorDetailByName(vendorDetail);

  // Handle errors - show not found page
  if (error || !data) {
    notFound();
  }

  const { customerData, activity } = data;
  const hasActivities = activity && activity.length > 0;

  const heroImageUrl = apiImageUrl(customerData.home_image_url);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Overlay */}
      <div className="relative">
        {/* Breadcrumb - Absolute positioned, mobile-friendly */}
        <div className="absolute top-2 left-0 right-0 z-10 sm:top-4">
          <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
            <nav aria-label="Breadcrumb">
              {/* Single-row scroll on mobile avoids awkward wraps; full labels on larger screens */}
              <ol className="flex flex-nowrap items-center gap-x-1 sm:gap-x-1.5 text-[11px] leading-tight sm:text-sm sm:leading-normal max-w-full overflow-x-auto overflow-y-hidden pb-1 sm:pb-0 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <li className="flex items-center gap-x-1 sm:gap-x-1.5 shrink-0">
                  <Link
                    href="/"
                    className="text-white/90 hover:text-white transition-colors backdrop-blur-sm bg-black/25 px-2 py-1.5 sm:px-3 sm:py-1.5 rounded-md sm:rounded-lg whitespace-nowrap"
                  >
                    Home
                  </Link>
                  <span className="text-white/50 select-none shrink-0" aria-hidden="true">
                    /
                  </span>
                </li>
                <li className="flex items-center gap-x-1 sm:gap-x-1.5 shrink-0">
                  <Link
                    href={parentHref}
                    className="text-white/90 hover:text-white transition-colors backdrop-blur-sm bg-black/25 px-2 py-1.5 sm:px-3 sm:py-1.5 rounded-md sm:rounded-lg max-w-[42vw] truncate sm:max-w-none sm:overflow-visible sm:whitespace-normal sm:text-clip"
                    title={parentLabel}
                  >
                    {parentLabel}
                  </Link>
                  <span className="text-white/50 select-none shrink-0" aria-hidden="true">
                    /
                  </span>
                </li>
                <li className="min-w-0 shrink" aria-current="page">
                  <span className="block text-white font-medium backdrop-blur-sm bg-black/25 px-2 py-1.5 sm:px-3 sm:py-1.5 rounded-md sm:rounded-lg truncate max-w-[min(100%,38vw)] sm:max-w-[min(100%,28rem)]">
                    {customerData.customer_display_name}
                  </span>
                </li>
              </ol>
            </nav>
          </div>
        </div>

        {/* Hero Image with Overlay */}
        <div className="relative h-[60vh] min-h-[500px] md:h-[70vh] overflow-hidden">
          {heroImageUrl ? (
            <>
              <Image
                src={heroImageUrl}
                alt={customerData.customer_display_name}
                fill
                sizes="100vw"
                className="object-cover"
                priority
                quality={90}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/70" />
            </>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-sky-900 via-blue-900 to-gray-900" />
          )}

          {/* Vendor Info Overlay */}
          <div className="relative h-full flex items-end">
            <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-12 md:pb-16">
              <div className="max-w-4xl">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 tracking-tight drop-shadow-lg">
                  {customerData.customer_display_name}
                </h1>

                {customerData.customer_city && (
                  <div className="flex items-center text-white/90 mb-4">
                    <FiMapPin className="w-5 h-5 mr-2 text-sky-300" />
                    <span className="text-lg md:text-xl font-medium">
                      {customerData.customer_city}
                    </span>
                  </div>
                )}

                {customerData.customer_description && (
                  <p className="text-lg md:text-xl text-white/95 max-w-3xl leading-relaxed drop-shadow-md">
                    {customerData.customer_description}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        {/* About Section */}
        {customerData.about_us && (
          <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 md:p-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">About Us</h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                {customerData.about_us}
              </p>
            </div>
          </section>
        )}

        {/* Activities Section */}
        <section className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Activities
            </h2>
            {hasActivities && (
              <p className="text-lg text-gray-600">
                Discover {activity.length}{" "}
                {activity.length === 1 ? "activity" : "activities"} available
                at this location
              </p>
            )}
          </div>

          {hasActivities ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {activity.map((activityItem) => (
                <ActivityCard
                  key={activityItem.id}
                  activity={activityItem}
                  vendorSlug={vendorDetail}
                  listingFrom={listingFrom}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-6">
                <FiActivity className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Activities Available
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
                We&apos;re currently updating our activity offerings. Please check
                back soon or explore other {listingFrom === "skates" ? "rings" : "resorts"}.
              </p>
              <Link
                href={parentHref}
                className="inline-flex items-center mt-6 px-6 py-3 bg-sky-600 text-white font-medium rounded-lg hover:bg-sky-700 transition-colors"
              >
                {listingFrom === "skates"
                  ? "Browse skating rings"
                  : "Browse ski slopes"}
                <FiArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
