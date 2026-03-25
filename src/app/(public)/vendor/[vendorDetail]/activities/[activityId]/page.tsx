import { headers } from "next/headers";
import {
  bookingPath,
  listingParent,
  resolveListingFrom,
  vendorPath,
} from "../../../../lib/listingContext";
import { fetchVendorActivityByID } from "./vendorActivityApi";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  FiClock,
  FiUsers,
  FiArrowLeft,
  FiAlertCircle,
  FiCheckCircle,
  FiInfo,
  FiShield,
  FiExternalLink,
} from "react-icons/fi";
import ImageGallery from "./ImageGallery";
import type { ActivitySchedule } from "./vendorActivityApi";

export const revalidate = 600; // Revalidate every 10 minutes

type Props = {
  params: Promise<{
    vendorDetail: string;
    activityId: string;
  }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function ActivityPage({ params, searchParams }: Props) {
  let vendorDetail: string;
  let activityId: string;

  try {
    const resolvedParams = await params;
    vendorDetail = resolvedParams.vendorDetail;
    activityId = resolvedParams.activityId;
  } catch (error) {
    console.error("Error resolving params:", error);
    notFound();
  }

  const [resolvedSearch, headersList] = await Promise.all([
    searchParams,
    headers(),
  ]);
  const listingFrom = resolveListingFrom(
    resolvedSearch.from,
    headersList.get("referer")
  );
  const { href: listHref, label: listLabel } = listingParent(listingFrom);

  const { data, error } = await fetchVendorActivityByID(activityId);

  // Handle errors - show not found page
  if (error || !data) {
    notFound();
  }

  // Prepare images array: use gallery images if available, otherwise fallback to thumbnail
  const images: string[] = [];
  
  if (data.activity_image_gallery && Array.isArray(data.activity_image_gallery) && data.activity_image_gallery.length > 0) {
    // Use gallery images if available (backend field: activity_image_gallery)
    images.push(...data.activity_image_gallery);
  } else if (data.activity_thumbnail_image) {
    // Fallback to thumbnail if no gallery images
    images.push(data.activity_thumbnail_image);
  }

  const dayOrder: Record<string, number> = {
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6,
    sunday: 7,
  };

  const formatTime = (value: string | null | undefined) => {
    if (!value) return "N/A";
    // API provides "HH:mm:ss"
    const [hRaw, mRaw] = value.split(":");
    const h = Number(hRaw);
    const m = Number(mRaw || "0");
    if (Number.isNaN(h) || Number.isNaN(m)) return value;
    const ampm = h >= 12 ? "PM" : "AM";
    const twelveHour = h % 12 || 12;
    return `${twelveHour}:${String(m).padStart(2, "0")} ${ampm}`;
  };

  const weeklySchedule: ActivitySchedule[] = Array.isArray(data.schedules)
    ? [...data.schedules].sort(
        (a, b) =>
          (dayOrder[a.day?.toLowerCase()] ?? 99) -
          (dayOrder[b.day?.toLowerCase()] ?? 99)
      )
    : [];

  const dataRecord = data as unknown as Record<string, unknown>;
  const firstText = (...values: Array<string | null | undefined>) =>
    values.find((value) => typeof value === "string" && value.trim().length > 0)
      ?.trim() ?? null;
  const fromKey = (key: string) => {
    const value = dataRecord[key];
    return typeof value === "string" ? value : null;
  };

  const activityTagline = firstText(
    fromKey("activity_tagline"),
    fromKey("tagline"),
    fromKey("short_description")
  );
  const activityMoreInfo = firstText(
    fromKey("additional_info"),
    fromKey("more_info"),
    fromKey("activity_notes"),
    fromKey("what_to_expect"),
    fromKey("included_items")
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-4">
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-nowrap items-center gap-x-1 text-[11px] sm:text-sm max-w-full overflow-x-auto overflow-y-hidden pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <li className="flex items-center gap-x-1 shrink-0">
                <Link href="/" className="text-gray-600 hover:text-gray-900 whitespace-nowrap">
                  Home
                </Link>
                <span className="text-gray-400 shrink-0">/</span>
              </li>
              <li className="flex items-center gap-x-1 shrink-0">
                <Link
                  href={listHref}
                  className="text-gray-600 hover:text-gray-900 max-w-[40vw] truncate sm:max-w-none sm:whitespace-normal sm:overflow-visible sm:text-clip"
                  title={listLabel}
                >
                  {listLabel}
                </Link>
                <span className="text-gray-400 shrink-0">/</span>
              </li>
              <li className="flex items-center gap-x-1 min-w-0 shrink">
                <Link
                  href={vendorPath(vendorDetail, listingFrom)}
                  className="text-gray-600 hover:text-gray-900 truncate max-w-[32vw] sm:max-w-[12rem]"
                >
                  {vendorDetail.replace(/-/g, " ")}
                </Link>
                <span className="text-gray-400 shrink-0">/</span>
              </li>
              <li className="text-gray-900 font-medium shrink-0 whitespace-nowrap">
                Activity
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Back Button */}
        <Link
          href={vendorPath(vendorDetail, listingFrom)}
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <FiArrowLeft className="w-5 h-5 mr-2" />
          <span>Back to Activities</span>
        </Link>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery + title: mobile = compact strip on image + details below; md+ = full overlay card */}
            <div className="relative overflow-hidden rounded-2xl">
              {images.length > 0 ? (
                <ImageGallery images={images} activityName={data.activity_name} />
              ) : (
                <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-sky-100 to-blue-100 flex items-center justify-center">
                  <FiInfo className="w-16 h-16 text-gray-400" />
                </div>
              )}
              {/* Mobile: thin gradient band + title only so the photo stays visible */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 md:hidden bg-gradient-to-t from-black/85 via-black/35 to-transparent pt-14 pb-3 px-4">
                <h1 className="text-xl font-bold tracking-tight text-white drop-shadow-md line-clamp-2">
                  {data.activity_name}
                </h1>
              </div>
              {/* md+: full overlay card */}
              <div className="absolute left-4 right-4 bottom-4 z-10 hidden md:block sm:left-6 sm:right-6 sm:bottom-6">
                <div className="rounded-2xl border border-white/20 bg-black/45 text-white backdrop-blur-md p-4 sm:p-5">
                  <h1 className="text-2xl sm:text-4xl font-bold tracking-tight">
                    {data.activity_name}
                  </h1>
                  <p className="text-sm sm:text-base text-white/90 mt-1">
                    {vendorDetail.replace(/-/g, " ")}
                  </p>
                  {activityTagline && (
                    <p className="text-sm sm:text-base text-white/90 mt-2">
                      {activityTagline}
                    </p>
                  )}
                </div>
              </div>
            </div>
            {/* Mobile: vendor + tagline below image */}
            <div className="md:hidden mt-3 rounded-2xl border border-gray-200 bg-white px-4 py-4 shadow-sm">
              <p className="text-sm font-medium text-gray-500 capitalize">
                {vendorDetail.replace(/-/g, " ")}
              </p>
              {activityTagline && (
                <p className="text-base text-gray-800 mt-2 leading-snug">
                  {activityTagline}
                </p>
              )}
            </div>

            {/* Description */}
            {data.activity_description && (
              <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  About This Activity
                </h2>
                <div className="prose prose-lg max-w-none">
                  <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                    {data.activity_description}
                  </p>
                </div>
              </section>
            )}

            {/* Safety Instructions */}
            {data.safety_instructions && (
              <section className="bg-blue-50 rounded-2xl border border-blue-200 p-8">
                <div className="flex items-start">
                  <FiShield className="w-6 h-6 text-blue-600 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-3">
                      Safety Instructions
                    </h2>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {data.safety_instructions}
                    </p>
                  </div>
                </div>
              </section>
            )}

            {/* More Info */}
            {activityMoreInfo && (
              <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  More Information
                </h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                  {activityMoreInfo}
                </p>
              </section>
            )}

          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Booking Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sticky top-6">
              <div className="space-y-6">
                {/* Price */}
                <div className="text-center pb-6 border-b border-gray-200">
                  <p className="text-sm text-gray-600 mb-2">Starting from</p>
                  <p className="text-4xl font-bold text-gray-900">
                    ${parseFloat(data.base_price).toFixed(2)}
                  </p>
                </div>

                {/* Quick Info */}
                <div className="space-y-4">
                  {data.duration_hours && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 flex items-center">
                        <FiClock className="w-5 h-5 mr-2 text-gray-400" />
                        Duration
                      </span>
                      <span className="font-medium text-gray-900">
                        {typeof data.duration_hours === "string"
                          ? data.duration_hours
                          : `${data.duration_hours} hours`}
                      </span>
                    </div>
                  )}
                  {data.age_group && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 flex items-center">
                        <FiUsers className="w-5 h-5 mr-2 text-gray-400" />
                        Age Group
                      </span>
                      <span className="font-medium text-gray-900">
                        {data.age_group}
                      </span>
                    </div>
                  )}
                </div>

                {/* Waiver Notice */}
                {data.requires_waiver && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <FiAlertCircle className="w-5 h-5 text-amber-600 mr-2 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-amber-800">
                        This activity requires a signed waiver
                      </p>
                    </div>
                  </div>
                )}

                {/* Book CTA: external site vs internal booking */}
                {data.redirect_to_external_website && data.external_booking_url ? (
                  <>
                    <p className="text-sm text-gray-600 text-center">
                      Booking is handled on the resort&apos;s website. You&apos;ll be redirected to complete your reservation.
                    </p>
                    <a
                      href={data.external_booking_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full"
                    >
                      <button
                        type="button"
                        className="w-full bg-sky-600 hover:bg-sky-700 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                      >
                        <span>Book on company website</span>
                        <FiExternalLink className="w-5 h-5" />
                      </button>
                    </a>
                  </>
                ) : (
                  <Link
                    href={bookingPath(vendorDetail, activityId, listingFrom)}
                    className="block w-full"
                  >
                    <button className="w-full bg-sky-600 hover:bg-sky-700 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center justify-center">
                      <span>Book Now</span>
                    </button>
                  </Link>
                )}

                {/* Cancellation Policy */}
                <div className="flex items-start text-sm text-gray-600 pt-4 border-t border-gray-200">
                  <FiCheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Free cancellation up to 24 hours before</span>
                </div>
              </div>
            </div>

            {/* Weekly Schedule */}
            {weeklySchedule.length > 0 && (
              <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                  Weekly Schedule
                </h2>
                <div className="space-y-2">
                  {weeklySchedule.map((slot) => (
                    <div
                      key={slot.id}
                      className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-3 py-2"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900">
                          {slot.day}
                        </p>
                        <p className="text-xs text-gray-600 truncate">
                          {slot.is_24hours
                            ? "Open 24 hours"
                            : `${formatTime(slot.start_time)} - ${formatTime(
                                slot.end_time
                              )}`}
                        </p>
                      </div>
                      {slot.is_holiday && (
                        <span className="ml-2 shrink-0 text-[10px] font-semibold uppercase tracking-wide bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
                          Holiday
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
