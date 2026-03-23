"use client";

import Link from "next/link";
import Image from "next/image";
import { FiMapPin } from "react-icons/fi";

type RegionCardProps = {
  name: string;
  slug: string;
  /** Ski region links to /[slug]; skating links to /skates/[slug] */
  variant?: "ski" | "skate";
};

const REGION_IMAGES: Record<string, string> = {
  Ontario:
    "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1600&q=80", // Toronto skyline / CN Tower
  Quebec:
    "https://images.unsplash.com/photo-1503435980610-a51f3ddfee50?auto=format&fit=crop&w=1600&q=80", // Old Quebec in winter
  // WallpapersDen blocks server/CDN requests (403); Unsplash works with next/image
  "British-Columbia":
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80",
  Mnitoba:
    "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1600&q=80", // Prairie winter
  "New-Brunswick":
    "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1600&q=80", // Coastal / lighthouse
  "Nova-Scotia":
    "https://images.unsplash.com/photo-1521185496955-15097b20c5fe?auto=format&fit=crop&w=1600&q=80", // Coastline / harbour
};

export default function RegionCard({
  name,
  slug,
  variant = "ski",
}: RegionCardProps) {
  const imageSrc = REGION_IMAGES[slug] ?? "/images/home-bg.jpg";
  const href = variant === "skate" ? `/skates/${slug}` : `/${slug}`;
  const ariaLabel =
    variant === "skate"
      ? `View skating rings in ${name}`
      : `View ski resorts in ${name}`;

  return (
    <Link
      href={href}
      className="group block relative aspect-[4/3] min-h-[165px] rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
      aria-label={ariaLabel}
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

      {/* Content — same layout for ski & skate; icon + title scale together */}
      <div className="relative h-full flex flex-col justify-between p-3.5 sm:p-4.5 md:p-5">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/20 backdrop-blur-sm mb-1.5 sm:mb-2 group-hover:bg-white/30 transition-colors">
            {variant === "skate" ? (
              <span className="text-base sm:text-lg leading-none" aria-hidden>
                ⛸️
              </span>
            ) : (
              <FiMapPin className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            )}
          </div>
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-1 sm:mb-1.5 drop-shadow-lg group-hover:scale-[1.02] transition-transform duration-300">
            {name}
          </h3>
        </div>

        <div className="text-center mt-auto pt-2">
          <div className="inline-flex max-w-full items-center justify-center px-4 sm:px-6 py-2 sm:py-3 rounded-full border-2 border-white/90 text-white font-semibold text-sm sm:text-base group-hover:bg-white/10 group-hover:border-white transition-all duration-300 backdrop-blur-sm">
            {variant === "skate"
              ? `Ice skating in ${name}`
              : "Browse ski resorts"}
          </div>
        </div>
      </div>
    </Link>
  );
}
