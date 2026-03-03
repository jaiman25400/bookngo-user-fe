import { fetchVendorActivityByID } from "./vendorActivityApi";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  FiClock,
  FiDollarSign,
  FiUsers,
  FiArrowLeft,
  FiAlertCircle,
  FiCheckCircle,
  FiInfo,
  FiShield,
  FiExternalLink,
} from "react-icons/fi";
import ImageGallery from "./ImageGallery";

export const revalidate = 600; // Revalidate every 10 minutes

type Props = {
  params: Promise<{
    vendorDetail: string;
    activityId: string;
  }>;
};

export default async function ActivityPage({ params }: Props) {
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm" aria-label="Breadcrumb">
            <Link
              href="/"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Home
            </Link>
            <span className="text-gray-400">/</span>
            <Link
              href="/skiing"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Resorts
            </Link>
            <span className="text-gray-400">/</span>
            <Link
              href={`/vendor/${vendorDetail}`}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              {vendorDetail.replace(/-/g, " ")}
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">Activity</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Back Button */}
        <Link
          href={`/vendor/${vendorDetail}`}
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <FiArrowLeft className="w-5 h-5 mr-2" />
          <span>Back to Activities</span>
        </Link>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            {images.length > 0 ? (
              <ImageGallery images={images} activityName={data.activity_name} />
            ) : (
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-gradient-to-br from-sky-100 to-blue-100 flex items-center justify-center">
                <FiInfo className="w-16 h-16 text-gray-400" />
              </div>
            )}

            {/* Title and Key Info */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
                {data.activity_name}
              </h1>

              {/* Key Info Badges */}
              <div className="flex flex-wrap gap-4">
                <div className="inline-flex items-center px-4 py-2 bg-sky-50 text-sky-700 rounded-lg border border-sky-200">
                  <FiDollarSign className="w-5 h-5 mr-2" />
                  <span className="font-semibold">
                    ${parseFloat(data.base_price).toFixed(2)}
                  </span>
                </div>
                {data.duration_hours && (
                  <div className="inline-flex items-center px-4 py-2 bg-gray-50 text-gray-700 rounded-lg border border-gray-200">
                    <FiClock className="w-5 h-5 mr-2" />
                    <span className="font-medium">
                      {typeof data.duration_hours === "string"
                        ? data.duration_hours
                        : `${data.duration_hours} hours`}
                    </span>
                  </div>
                )}
                {data.age_group && (
                  <div className="inline-flex items-center px-4 py-2 bg-gray-50 text-gray-700 rounded-lg border border-gray-200">
                    <FiUsers className="w-5 h-5 mr-2" />
                    <span className="font-medium">{data.age_group}</span>
                  </div>
                )}
              </div>
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
                    href={`/vendor/${vendorDetail}/activities/${activityId}/book`}
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
          </div>
        </div>
      </div>
    </div>
  );
}
