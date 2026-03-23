"use client";

import RegionCard from "./RegionCard";
import {
  regionCardColClasses,
  regionCardsScrollClasses,
} from "./regionExploreShared";

const regions = [
  { name: "Ontario", slug: "Ontario" },
  { name: "Quebec", slug: "Quebec" },
  { name: "British Columbia", slug: "British-Columbia" },
  { name: "Manitoba", slug: "Mnitoba" },
  { name: "New Brunswick", slug: "New-Brunswick" },
  { name: "Nova Scotia", slug: "Nova-Scotia" },
];

export default function SkatingRegionsSection() {
  return (
    <div>
      <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight mb-2 flex items-center gap-2">
        <span
          aria-hidden="true"
          className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-cyan-100 text-lg"
        >
          ⛸️
        </span>
        Find ice skating by region
      </h2>
      <p className="text-slate-600 text-base mb-6 sm:mb-8">
        Browse skating rings in your province
      </p>

      <div className="relative">
        <div className={regionCardsScrollClasses}>
          {regions.map((region) => (
            <div key={region.slug} className={regionCardColClasses}>
              <RegionCard name={region.name} slug={region.slug} variant="skate" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
