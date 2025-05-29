import Image from "next/image";
import { fetchVendorActivityByID } from "./vendorActivityApi";
import {
  ClockIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  UserGroupIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import { notFound } from "next/navigation";

// Revalidate every 10 minutes
export const revalidate = 600; 

type Props = {
  params: {
    activityId: string;
  };
};

export default async function ActivityPage({ params }: Props) {
  const { activityId } = params;
  const { data, error } = await fetchVendorActivityByID(activityId);

  if (error || !data) {
    notFound();
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header Section */}
      <header className="space-y-6">
        <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
          {data.activity_name}
        </h1>

        <div className="flex flex-wrap gap-4 text-gray-600">
          <div className="flex items-center gap-1">
            <CurrencyDollarIcon className="w-5 h-5" />
            <span>From ${data.base_price}</span>
          </div>
          <div className="flex items-center gap-1">
            <ClockIcon className="w-5 h-5" />
            <span>{data.duration_hours} hours</span>
          </div>
          {data.age_group && (
            <div className="flex items-center gap-1">
              <UserGroupIcon className="w-5 h-5" />
              <span>{data.age_group}</span>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div className="grid gap-12 lg:grid-cols-3">
        {/* Main Content Column */}
        <div className="lg:col-span-2 space-y-12">
          {/* Image Gallery */}
          {data.activity_thumbnail_image && (
            <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-50">
              <Image
                src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${data.activity_thumbnail_image}`}
                alt={data.activity_name}
                fill
                sizes="(max-width: 768px) 100vw, 80vw"
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* Description */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Description</h2>
            <p className="text-gray-600 leading-relaxed">
              {data.activity_description}
            </p>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Info Card */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Quick Info</h3>

            <div className="space-y-2">
              {data.requires_waiver && (
                <div className="flex items-center gap-2 text-red-600">
                  <span className="text-sm">Requires signed waiver</span>
                </div>
              )}

              {data.safety_instructions && (
                <div className="pt-4 border-t border-gray-100">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">
                    Safety Instructions
                  </h4>
                  <p className="text-sm text-gray-600">
                    {data.safety_instructions}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Booking Info */}
          <div className="bg-blue-50 p-6 rounded-xl space-y-4">
            <button className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors">
              Book Now
            </button>
            <p className="text-sm text-gray-600 text-center">
              Free cancellation up to 24 hours before
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}