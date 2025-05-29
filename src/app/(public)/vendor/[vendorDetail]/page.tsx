import Image from "next/image";
import { fetchVendorDetailByName } from "./vendorDetailApi";
import Link from "next/link";

type Props = {
  params: {
    vendorDetail: string;
  };
};

export default async function VendorPage({ params }: Props) {
  const { vendorDetail } = params;
  const { data, error } = await fetchVendorDetailByName(vendorDetail);

  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center text-red-600">
        <p className="text-lg font-medium">Error loading vendor details:</p>
        <p className="mt-2 text-gray-600">{error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center text-gray-600">
        <p className="text-lg font-medium">No vendor data found</p>
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Vendor Header Section */}
      <header className="text-center space-y-8">
        {data.customerData.home_image_url && (
          <div className="relative aspect-video rounded-xl shadow-xl overflow-hidden bg-gray-50">
            <Image
              src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${data.customerData.home_image_url}`}
              alt={data.customerData.customer_display_name}
              fill
              sizes="(max-width: 768px) 100vw, 80vw"
              className="object-cover"
              priority
            />
          </div>
        )}

        <div className="space-y-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
            {data.customerData.customer_display_name}
          </h1>

          {data.customerData.customer_city && (
            <p className="text-lg text-gray-600 font-medium">
              Located in {data.customerData.customer_city}
            </p>
          )}

          {data.customerData.customer_description && (
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              {data.customerData.customer_description}
            </p>
          )}
        </div>
      </header>

      {/* About Section */}
      {data.customerData.about_us && (
        <section className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">About Us</h2>
          <p className="text-gray-600 leading-relaxed">
            {data.customerData.about_us}
          </p>
        </section>
      )}

      {/* Activities Section */}
      <section className="space-y-10">
        <h2 className="text-2xl font-bold text-gray-900 text-center">
          Our Activities
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.activity?.map((activity: any) => (
            <Link
              href={`/vendor/${vendorDetail}/activities/${activity.id}`}
              className="group block" // Remove hover styles from parent div
              key={activity.id}
            >
              <article
                key={activity.id}
                className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                {activity.activity_thumbnail_image && (
                  <div className="relative aspect-square bg-gray-50">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${activity.activity_thumbnail_image}`}
                      alt={activity.activity_name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover rounded-t-xl"
                    />
                  </div>
                )}

                <div className="p-5 space-y-3">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {activity.activity_name}
                  </h3>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-medium text-blue-600">
                      ${parseFloat(activity.base_price).toFixed(2)}
                    </span>
                    <span className="text-gray-500 text-sm">
                      {activity.duration_hours}h
                    </span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>

        {!data.activity?.length && (
          <p className="text-center text-gray-500 py-10">
            No activities currently available
          </p>
        )}
      </section>
    </main>
  );
}
