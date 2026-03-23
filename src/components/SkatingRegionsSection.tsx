"use client";

import Image from "next/image";
import Link from "next/link";

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
    <section className="rounded-3xl border border-cyan-100 bg-gradient-to-br from-cyan-50 via-sky-50 to-white p-4 sm:p-6 md:p-8">
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="flex items-center gap-2 text-xl font-bold tracking-tight text-slate-900 md:text-2xl">
            <span
              aria-hidden="true"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-cyan-200/70 text-lg"
            >
              ⛸️
            </span>
            Find ice skating by region
          </h2>
          <p className="mt-1 text-base text-slate-600">
            Browse skating rings in your province
          </p>
        </div>
        <span className="inline-flex w-fit items-center rounded-full border border-cyan-200 bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-cyan-700">
          Featured Regions
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {regions.map((region) => (
          <Link
            key={region.slug}
            href={`/skates/${region.slug}`}
            className="group overflow-hidden rounded-2xl border border-cyan-100 bg-white shadow-sm transition-all hover:shadow-md"
            aria-label={`View skating rings in ${region.name}`}
          >
            <div className="relative h-36 sm:h-40">
              <Image
                src={REGION_IMAGES[region.slug] ?? "/images/home-bg.jpg"}
                alt={`${region.name} skating region`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                quality={85}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute left-3 top-3 inline-flex items-center rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-cyan-800">
                ⛸️ Skating
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-lg font-bold text-slate-900">{region.name}</h3>
              <div className="mt-3 inline-flex items-center rounded-lg bg-cyan-600 px-3 py-2 text-sm font-semibold text-white transition-colors group-hover:bg-cyan-700">
                Explore rings
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
