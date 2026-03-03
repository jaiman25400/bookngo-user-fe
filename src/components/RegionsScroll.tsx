"use client"; // Add this for client-side interactions
import RegionCard from "./RegionCard";

const regions = [
  { name: "Ontario", slug: "Ontario" },
  { name: "Quebec", slug: "Quebec" },
  { name: "British Columbia", slug: "British-Columbia" },
  { name: "Manitoba", slug: "Mnitoba" },
  { name: "New Brunswick", slug: "New-Brunswick" },
  { name: "Nova Scotia", slug: "Nova-Scotia" },
];
export default function RegionsScroll() {
  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight mb-2">
          Find slopes by region
        </h2>
        <p className="text-slate-600 text-base mb-8">
          Browse ski resorts in your province
        </p>
        
        {/* Scroll Container */}
        <div className="relative">
          <div className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4 gap-4">
            {regions.map((region) => (
              <div 
                key={region.slug}
                className="flex-shrink-0 w-[85vw] md:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-1rem)] snap-start"
              >
                <RegionCard name={region.name} slug={region.slug} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
