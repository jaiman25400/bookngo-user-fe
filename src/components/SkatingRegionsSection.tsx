"use client";

import Image from "next/image";
import Link from "next/link";

const regions = [
  { name: "Ontario", slug: "Ontario" },
  { name: "Quebec", slug: "Quebec" },
  { name: "British Columbia", slug: "British-Columbia" },
  { name: "Manitoba", slug: "Manitoba" },
  { name: "New Brunswick", slug: "New-Brunswick" },
  { name: "Nova Scotia", slug: "Nova-Scotia" },
];

const REGION_IMAGES: Record<string, string> = {
  Ontario:
    "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1600&q=80",
  Quebec:
    "https://images.unsplash.com/photo-1503435980610-a51f3ddfee50?auto=format&fit=crop&w=1600&q=80",
  "British-Columbia":
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80",
  Manitoba:
    "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1600&q=80",
  "New-Brunswick":
    "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1600&q=80",
  "Nova-Scotia":
    "https://images.unsplash.com/photo-1521185496955-15097b20c5fe?auto=format&fit=crop&w=1600&q=80",
};

export default function SkatingRegionsSection() {
  return (
    <div>
      <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight mb-1 flex items-center gap-2">
        <span
          aria-hidden="true"
          className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-cyan-100 text-lg"
        >
          ⛸️
        </span>
        Find ice skating by region
      </h2>
      <p className="text-slate-600 text-base mb-6">
        Browse skating rinks in your province
      </p>

      {/* Match reference style: compact horizontal cards with minimal chrome */}
      <div className="relative">
        <div className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-3">
          {regions.map((region) => (
            <Link
              key={region.slug}
              href={`/skates/${region.slug}`}
              className="group relative flex-shrink-0 w-[84vw] sm:w-[68vw] md:w-[48vw] lg:w-[34vw] xl:w-[27vw] min-w-[260px] snap-start rounded-md overflow-hidden border border-slate-200 bg-white"
              aria-label={`View skating rinks in ${region.name}`}
            >
              <div className="relative h-40 sm:h-44 lg:h-48">
                <Image
                  src={REGION_IMAGES[region.slug] ?? "/images/home-bg.jpg"}
                  alt={`${region.name} skating region`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 84vw, (max-width: 1024px) 68vw, (max-width: 1280px) 48vw, (max-width: 1536px) 34vw, 27vw"
                  quality={84}
                />
                <div className="absolute inset-0 bg-black/30" />

                <p className="absolute top-3 left-1/2 -translate-x-1/2 text-white text-base sm:text-lg font-bold whitespace-nowrap drop-shadow">
                  {region.name}
                </p>

                <span className="absolute bottom-3 left-1/2 -translate-x-1/2 inline-flex items-center rounded-[3px] border border-white/85 bg-black/25 px-3 py-1 text-[10px] font-semibold text-white tracking-wide">
                  Search
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <p className="mt-2 text-xs text-slate-500 sm:hidden">Swipe to explore more regions</p>
    </div>
  );
}
