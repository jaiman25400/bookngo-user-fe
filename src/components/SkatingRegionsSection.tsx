"use client";

import Link from "next/link";
import Image from "next/image";

const regions = [
  { name: "Ontario", slug: "Ontario" },
  { name: "Quebec", slug: "Quebec" },
  { name: "British Columbia", slug: "British-Columbia" },
  { name: "Manitoba", slug: "Mnitoba" },
  { name: "New Brunswick", slug: "New-Brunswick" },
  { name: "Nova Scotia", slug: "Nova-Scotia" },
];

const REGION_IMAGES: Record<string, string> = {
  Ontario:
    "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1600&q=80",
  Quebec:
    "https://images.unsplash.com/photo-1503435980610-a51f3ddfee50?auto=format&fit=crop&w=1600&q=80",
  "British-Columbia":
    "https://images.unsplash.com/photo-1519680772-8b5d0b1f9a1a?auto=format&fit=crop&w=1600&q=80",
  Mnitoba:
    "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1600&q=80",
  "New-Brunswick":
    "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1600&q=80",
  "Nova-Scotia":
    "https://images.unsplash.com/photo-1521185496955-15097b20c5fe?auto=format&fit=crop&w=1600&q=80",
};

export default function SkatingRegionsSection() {
  return (
    <section className="py-12 md:py-16 bg-white border-t border-slate-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight mb-2">
          Find ice skating by region
        </h2>
        <p className="text-slate-600 text-base mb-8">
          Browse skating rings in your province
        </p>

        <div className="relative">
          <div className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4 gap-4">
            {regions.map((region) => (
              <div
                key={region.slug}
                className="flex-shrink-0 w-[85vw] md:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-1rem)] snap-start"
              >
                <Link
                  href={`/skates/${region.slug}`}
                  className="group block relative aspect-[4.5/3] rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
                  aria-label={`View skating rings in ${region.name}`}
                >
                  <div className="absolute inset-0">
                    <Image
                      src={REGION_IMAGES[region.slug] ?? "/images/home-bg.jpg"}
                      alt={`${region.name} region`}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 85vw, (max-width: 1024px) 50vw, 33vw"
                      quality={85}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30 group-hover:from-black/90 transition-colors duration-300" />
                  </div>

                  <div className="relative h-full flex flex-col justify-between p-6">
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm mb-3 group-hover:bg-white/30 transition-colors">
                        <span className="text-2xl">⛸️</span>
                      </div>
                      <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 drop-shadow-lg group-hover:scale-105 transition-transform duration-300">
                        {region.name}
                      </h3>
                    </div>

                    <div className="text-center">
                      <div className="inline-flex items-center justify-center px-6 py-3 rounded-full border-2 border-white/90 text-white font-semibold text-base group-hover:bg-white/10 group-hover:border-white transition-all duration-300 backdrop-blur-sm">
                        Ice skating in {region.name}
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
