"use client";

import Image from "next/image";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";

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
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80",
  Mnitoba:
    "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1600&q=80",
  "New-Brunswick":
    "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1600&q=80",
  "Nova-Scotia":
    "https://images.unsplash.com/photo-1521185496955-15097b20c5fe?auto=format&fit=crop&w=1600&q=80",
};

export default function SkatingRegionsSection() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-cyan-200/50 bg-gradient-to-br from-slate-900 via-cyan-950 to-slate-900 p-4 sm:p-6 md:p-8">
      <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-cyan-400/20 blur-3xl" />
      <div className="pointer-events-none absolute -left-20 bottom-0 h-48 w-48 rounded-full bg-sky-300/20 blur-3xl" />

      <div className="relative mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="flex items-center gap-2 text-xl font-bold tracking-tight text-white md:text-2xl">
            <span
              aria-hidden="true"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-lg"
            >
              ⛸️
            </span>
            Find ice skating by region
          </h2>
          <p className="mt-1 text-base text-cyan-100/90">
            Browse skating rings in your province
          </p>
        </div>
        <span className="inline-flex w-fit items-center rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-cyan-100">
          Featured Regions
        </span>
      </div>

      <div className="relative grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {regions.map((region, idx) => {
          const isFeatured = idx === 0;
          if (isFeatured) {
            return (
              <Link
                key={region.slug}
                href={`/skates/${region.slug}`}
                className="group relative overflow-hidden rounded-2xl border border-white/20 bg-white/10 shadow-xl md:col-span-2 xl:col-span-2"
                aria-label={`View skating rings in ${region.name}`}
              >
                <div className="relative h-56 sm:h-64 md:h-full md:min-h-[23rem]">
                  <Image
                    src={REGION_IMAGES[region.slug] ?? "/images/home-bg.jpg"}
                    alt={`${region.name} skating region`}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 66vw, 66vw"
                    quality={88}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/10" />
                </div>
                <div className="absolute inset-x-0 bottom-0 p-5 md:p-7">
                  <p className="mb-2 inline-flex items-center rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white backdrop-blur">
                    Spotlight Region
                  </p>
                  <h3 className="text-2xl md:text-3xl font-bold text-white">
                    {region.name}
                  </h3>
                  <p className="mt-1 text-sm md:text-base text-cyan-100/90">
                    Discover top skating rings and book in minutes.
                  </p>
                  <span className="mt-4 inline-flex items-center rounded-xl bg-cyan-500 px-4 py-2 text-sm font-semibold text-white transition-colors group-hover:bg-cyan-400">
                    Explore rings
                    <FiArrowRight className="ml-2" />
                  </span>
                </div>
              </Link>
            );
          }

          return (
            <Link
              key={region.slug}
              href={`/skates/${region.slug}`}
              className="group relative overflow-hidden rounded-2xl border border-white/20 bg-white/10 shadow-lg"
              aria-label={`View skating rings in ${region.name}`}
            >
              <div className="relative h-44 sm:h-48">
                <Image
                  src={REGION_IMAGES[region.slug] ?? "/images/home-bg.jpg"}
                  alt={`${region.name} skating region`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                  quality={84}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
              </div>
              <div className="absolute inset-x-0 bottom-0 p-4">
                <div className="inline-flex items-center rounded-full bg-white/20 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur">
                  ⛸️ Skating
                </div>
                <h3 className="mt-2 text-lg font-bold text-white">{region.name}</h3>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
