"use client";

import { useRef } from "react";
import RegionCard from "./RegionCard";
import {
  regionCardColClasses,
  regionCardsScrollClasses,
} from "./regionExploreShared";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const regions = [
  { name: "Ontario", slug: "Ontario" },
  { name: "Quebec", slug: "Quebec" },
  { name: "British Columbia", slug: "British-Columbia" },
  { name: "Manitoba", slug: "Mnitoba" },
  { name: "New Brunswick", slug: "New-Brunswick" },
  { name: "Nova Scotia", slug: "Nova-Scotia" },
];

export default function RegionsScroll() {
  const sliderRef = useRef<HTMLDivElement | null>(null);

  const scrollByCards = (direction: "left" | "right") => {
    const el = sliderRef.current;
    if (!el) return;
    const amount = Math.max(el.clientWidth * 0.7, 320);
    el.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <div>
      <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight mb-2 flex items-center gap-2">
        <span
          aria-hidden="true"
          className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-sky-100 text-lg"
        >
          ⛷️
        </span>
        Find ski resorts by region
      </h2>
      <p className="text-slate-600 text-base mb-6 sm:mb-8">
        Browse ski resorts in your province
      </p>

      <div className="relative">
        <div className="absolute right-0 -top-14 hidden lg:flex items-center gap-2">
          <button
            type="button"
            onClick={() => scrollByCards("left")}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition-colors"
            aria-label="Scroll ski regions left"
          >
            <FiChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => scrollByCards("right")}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition-colors"
            aria-label="Scroll ski regions right"
          >
            <FiChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div ref={sliderRef} className={regionCardsScrollClasses}>
          {regions.map((region) => (
            <div key={region.slug} className={regionCardColClasses}>
              <RegionCard name={region.name} slug={region.slug} variant="ski" />
            </div>
          ))}
        </div>
      </div>
      <p className="mt-2 text-xs text-slate-500 sm:hidden">Swipe to explore more regions</p>
    </div>
  );
}
