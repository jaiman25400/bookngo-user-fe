import Link from "next/link";
import { FiAlertCircle } from "react-icons/fi";

export default function SkatingRegionNotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 pt-16">
      <div className="text-center max-w-md">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 text-amber-600 mb-6">
          <FiAlertCircle className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          No ice skating rinks in this region
        </h1>
        <p className="text-gray-600 mb-8">
          We couldn&apos;t find any skating venues here. Try another region or browse all rinks.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/skates"
            className="inline-flex items-center justify-center px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-xl transition-colors"
          >
            All skating rinks
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 hover:border-gray-400 text-gray-700 font-semibold rounded-xl transition-colors"
          >
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}
