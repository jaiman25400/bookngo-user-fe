import Image from "next/image";
import Link from "next/link";
import RegionsScroll from "../../components/RegionsScroll";

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <div className="relative h-screen pt-16">
        {" "}
        {/* Add pt-16 for navbar height */}
        {/* Background Image */}
        <div className="fixed inset-0 -z-50">
          {" "}
          {/* Changed to fixed */}
          <Image
            src="/images/home-bg.jpg"
            alt="Ski Resort"
            fill
            priority
            className="object-cover"
            quality={80}
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        {/* Hero Content */}
        <div className="container mx-auto px-4 h-full flex items-center justify-center text-center">
          <div className="max-w-ld  ">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Book Your Winter Adventure
            </h1>
            <p className="text-xl md:text-2xl text-white mb-8">
              Discover the best ski resorts and winter activities across Canada
            </p>
            <div className="flex flex-col md:flex-row justify-center gap-4 md:gap-6">
              <Link
                href="/skiing"
                className="bg-sky-600 hover:bg-sky-700 text-white px-8 py-3 rounded-lg text-lg transition-colors"
              >
                Browse Resorts
              </Link>
              <Link
                href="/activities"
                className="bg-white/90 hover:bg-white text-gray-800 px-8 py-3 rounded-lg text-lg transition-colors"
              >
                View Activities
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <RegionsScroll />
        </div>
      </div>
    </>
  );
}
