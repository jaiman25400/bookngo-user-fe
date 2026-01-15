import BookingForm from "./BookingForm";
import { fetchVendorActivityByID, type ActivityData } from "../vendorActivityApi";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { FiArrowLeft, FiDollarSign, FiClock, FiUsers } from "react-icons/fi";

type Props = {
  params: Promise<{
    vendorDetail: string;
    activityId: string;
  }>;
};

export default async function BookingPage({ params }: Props) {
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
  
  if (error || !data) {
    notFound();
  }

  const imageUrl = data.activity_thumbnail_image
    ? `${process.env.NEXT_PUBLIC_API_BASE_URL}${data.activity_thumbnail_image}`
    : null;

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
            <Link
              href={`/vendor/${vendorDetail}/activities/${activityId}`}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Activity
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">Booking</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Back Button */}
        <Link
          href={`/vendor/${vendorDetail}/activities/${activityId}`}
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8 transition-colors"
        >
          <FiArrowLeft className="w-5 h-5 mr-2" />
          <span>Back to Activity</span>
        </Link>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content - Booking Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
              <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  Complete Your Booking
                </h1>
                <p className="text-gray-600">
                  Please fill in your details to proceed with the booking
                </p>
              </div>

              <BookingForm
                activityId={activityId}
                vendorSlug={vendorDetail}
              />
            </div>
          </div>

          {/* Sidebar - Booking Summary */}
          <div className="space-y-6">
            {/* Activity Summary Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden sticky top-6">
              {/* Activity Image */}
              {imageUrl && (
                <div className="relative aspect-video bg-gray-100">
                  <Image
                    src={imageUrl}
                    alt={data.activity_name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    className="object-cover"
                    quality={85}
                  />
                </div>
              )}

              {/* Activity Info */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {data.activity_name}
                </h3>

                {/* Activity Details */}
                <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 flex items-center text-sm">
                      <FiDollarSign className="w-4 h-4 mr-2 text-gray-400" />
                      Price per ticket
                    </span>
                    <span className="font-semibold text-gray-900">
                      ${parseFloat(data.base_price).toFixed(2)}
                    </span>
                  </div>
                  {data.duration_hours && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 flex items-center text-sm">
                        <FiClock className="w-4 h-4 mr-2 text-gray-400" />
                        Duration
                      </span>
                      <span className="font-medium text-gray-900 text-sm">
                        {typeof data.duration_hours === "string"
                          ? data.duration_hours
                          : `${data.duration_hours} hours`}
                      </span>
                    </div>
                  )}
                  {data.age_group && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 flex items-center text-sm">
                        <FiUsers className="w-4 h-4 mr-2 text-gray-400" />
                        Age Group
                      </span>
                      <span className="font-medium text-gray-900 text-sm">
                        {data.age_group}
                      </span>
                    </div>
                  )}
                </div>

                {/* Total Calculation Placeholder */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Subtotal</span>
                    <span className="text-sm font-medium text-gray-900">
                      ${parseFloat(data.base_price).toFixed(2)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Final price calculated after ticket selection
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
