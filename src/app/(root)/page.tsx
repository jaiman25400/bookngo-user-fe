import Image from "next/image";
import Link from "next/link";
import RegionsScroll from "../../components/RegionsScroll";
import { FiArrowRight } from "react-icons/fi";

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <div className="relative h-screen pt-16">
        {/* Background Image */}
        <div className="fixed inset-0 -z-50">
          <Image
            src="/images/home-bg.jpg"
            alt="Winter ski resort landscape"
            fill
            priority
            className="object-cover"
            quality={90}
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60" />
        </div>

        {/* Hero Content */}
        <div className="container mx-auto px-4 h-full flex items-center justify-center text-center">
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
              Book Your Winter Adventure
            </h1>
            <p className="text-xl md:text-2xl lg:text-3xl text-white/95 mb-10 leading-relaxed drop-shadow-md">
              Discover the best ski resorts and winter activities across Canada
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 md:gap-6">
              <Link
                href="/skiing"
                className="group inline-flex items-center justify-center bg-sky-600 hover:bg-sky-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                aria-label="Browse ski resorts"
              >
                Browse Resorts
                <FiArrowRight className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/activities"
                className="inline-flex items-center justify-center bg-white/95 hover:bg-white text-gray-900 px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                aria-label="View all activities"
              >
                View Activities
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1.5 h-3 bg-white/50 rounded-full mt-2"></div>
          </div>
        </div>
      </div>

      {/* Regions Section */}
      <div className="bg-white relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <RegionsScroll />
        </div>
      </div>
    </>
  );
}
