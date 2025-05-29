// RegionCard.tsx
import Link from "next/link";

type RegionCardProps = {
  name: string;
  slug: string;
};

export default function RegionCard({ name, slug }: RegionCardProps) {
  return (
    <div className="relative aspect-[4.5/3] rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all group">
      {/* Background Image with Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20" />
      <img
        src="/images/home-bg.jpg"
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Content Container */}
      <div className="relative h-full flex flex-col justify-between p-6">
        {/* Region Name - Top Center */}
        <div className="text-center">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 drop-shadow-lg">
            {name}
          </h3>
        </div>

        {/* Search Button - Bottom Center */}
        <div className="text-center">
          <Link
            href={`/${slug}`}
            className="inline-flex items-center justify-center px-5 py-3 rounded-full border-2 border-white text-white hover:bg-white/10 hover:border-white/80 hover:backdrop-blur-sm transition-all duration-300 font-medium text-lg"
          >
            Search Resorts
          </Link>
        </div>
      </div>
    </div>
  );
}
