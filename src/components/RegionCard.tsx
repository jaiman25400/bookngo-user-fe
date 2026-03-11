"use client";

import Link from "next/link";
import Image from "next/image";
import { FiMapPin } from "react-icons/fi";

type RegionCardProps = {
  name: string;
  slug: string;
};

const REGION_IMAGES: Record<string, string> = {
  Ontario:
    "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1600&q=80", // Toronto skyline / CN Tower
  Quebec:
    "https://images.unsplash.com/photo-1503435980610-a51f3ddfee50?auto=format&fit=crop&w=1600&q=80", // Old Quebec in winter
  "British-Columbia":
    "https://images.unsplash.com/photo-1519680772-8b5d0b1f9a1a?auto=format&fit=crop&w=1600&q=80", // Mountains / Whistler-style
  Mnitoba:
    "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1600&q=80", // Prairie winter
  "New-Brunswick":
    "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1600&q=80", // Coastal / lighthouse
  "Nova-Scotia":
    "https://images.unsplash.com/photo-1521185496955-15097b20c5fe?auto=format&fit=crop&w=1600&q=80", // Coastline / harbour
};

export default function RegionCard({ name, slug }: RegionCardProps) {
  const imageSrc = REGION_IMAGES[slug] ?? "/images/home-bg.jpg";

  return (
    <Link
      href={`/${slug}`}
      className="group block relative aspect-[4.5/3] rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
      aria-label={`View resorts in ${name}`}
    >
      {/* Background Image with Gradient Overlay */}
      <div className="absolute inset-0">
        <Image
          src={imageSrc}
          alt={`${name} region background`}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 85vw, (max-width: 1024px) 50vw, 33vw"
          quality={85}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30 group-hover:from-black/90 transition-colors duration-300" />
      </div>

      {/* Content Container */}
      <div className="relative h-full flex flex-col justify-between p-6">
        {/* Region Name - Top Center */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm mb-3 group-hover:bg-white/30 transition-colors">
            <FiMapPin className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 drop-shadow-lg group-hover:scale-105 transition-transform duration-300">
            {name}
          </h3>
        </div>

        {/* Search Button - Bottom Center */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center px-6 py-3 rounded-full border-2 border-white/90 text-white font-semibold text-base group-hover:bg-white/10 group-hover:border-white transition-all duration-300 backdrop-blur-sm">
            Search Resorts
          </div>
        </div>
      </div>
    </Link>
  );
}
