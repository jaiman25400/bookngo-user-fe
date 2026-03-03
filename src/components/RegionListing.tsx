"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FiMapPin, FiArrowRight, FiSearch, FiX, FiSliders } from "react-icons/fi";

export interface RegionListingItem {
  id: number;
  name: string;
  slug: string;
  city: string;
  imageUrl: string | null;
}

type SortOption = "name-asc" | "name-desc" | "city-asc" | "city-desc";

interface RegionListingProps {
  results: RegionListingItem[];
  regionName: string;
  activityLabel: string;
  itemLabel: string;
  itemLabelPlural: string;
  basePath: string;
  emptyMessage?: string;
}

function VenueCard({
  item,
  itemLabel,
}: {
  item: RegionListingItem;
  itemLabel: string;
}) {
  return (
    <Link
      href={`/vendor/${item.slug}`}
      className="group block bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-100 h-full flex flex-col"
    >
      <div className="relative aspect-[16/10] bg-gradient-to-br from-sky-100 to-blue-100 overflow-hidden">
        {item.imageUrl ? (
          <>
            <Image
              src={item.imageUrl}
              alt={item.name || "Venue image"}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              loading="lazy"
              quality={85}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-500">
            <span className="text-4xl mb-2">{itemLabel === "resort" ? "⛷️" : "⛸️"}</span>
            <span className="text-sm font-medium">No image available</span>
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
          <h3 className="text-lg font-bold text-white drop-shadow line-clamp-2 group-hover:text-sky-200 transition-colors">
            {item.name || "Unnamed"}
          </h3>
          {item.city && (
            <p className="flex items-center text-white/90 text-sm mt-1">
              <FiMapPin className="w-3.5 h-3.5 mr-1.5 flex-shrink-0" />
              <span className="line-clamp-1">{item.city}</span>
            </p>
          )}
        </div>
      </div>
      <div className="p-5 flex-1 flex flex-col">
        <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between text-sky-600 group-hover:text-sky-700 font-medium text-sm">
          <span>View {itemLabel}</span>
          <FiArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
}

export default function RegionListing({
  results,
  regionName,
  activityLabel,
  itemLabel,
  itemLabelPlural,
  basePath,
  emptyMessage = "No results match your filters.",
}: RegionListingProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("name-asc");
  const [cityFilter, setCityFilter] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);

  const cities = useMemo(() => {
    const set = new Set<string>();
    results.forEach((r) => r.city && set.add(r.city));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [results]);

  const filteredAndSorted = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    let list = results.filter((item) => {
      const matchSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        (item.city && item.city.toLowerCase().includes(q));
      const matchCity = cityFilter === "all" || item.city === cityFilter;
      return matchSearch && matchCity;
    });
    list = [...list].sort((a, b) => {
      switch (sortBy) {
        case "name-asc":
          return (a.name || "").localeCompare(b.name || "");
        case "name-desc":
          return (b.name || "").localeCompare(a.name || "");
        case "city-asc":
          return (a.city || "").localeCompare(b.city || "");
        case "city-desc":
          return (b.city || "").localeCompare(a.city || "");
        default:
          return 0;
      }
    });
    return list;
  }, [results, searchQuery, cityFilter, sortBy]);

  const hasActiveFilters = searchQuery.trim() !== "" || cityFilter !== "all";

  return (
    <div className="min-h-screen bg-white pt-16">
      {/* Hero */}
      <div className="bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <nav className="flex items-center mb-6 text-sm">
            <Link href="/" className="text-slate-300 hover:text-white transition-colors">
              Home
            </Link>
            <span className="mx-2 text-slate-500">/</span>
            <Link href={basePath} className="text-slate-300 hover:text-white transition-colors">
              {activityLabel}
            </Link>
            <span className="mx-2 text-slate-500">/</span>
            <span className="font-medium text-white">{regionName}</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2">
            {activityLabel} in {regionName}
          </h1>
          <p className="text-lg text-slate-300">
            {results.length} {itemLabelPlural} in {regionName}
          </p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="sticky top-14 z-10 bg-white/95 backdrop-blur border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder={`Search by name or city...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-sky-500/40 focus:border-sky-400 outline-none transition-all"
                aria-label="Search"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  aria-label="Clear search"
                >
                  <FiX className="w-5 h-5" />
                </button>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setShowFilters((s) => !s)}
                className={`inline-flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-colors ${
                  showFilters || hasActiveFilters
                    ? "bg-slate-100 border-slate-300 text-slate-800"
                    : "bg-white border-slate-200 text-slate-700 hover:border-slate-300"
                }`}
              >
                <FiSliders className="w-4 h-4" />
                Filters
                {hasActiveFilters && (
                  <span className="w-2 h-2 rounded-full bg-sky-500" />
                )}
              </button>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-medium focus:ring-2 focus:ring-sky-500/40 focus:border-sky-400 outline-none"
                aria-label="Sort by"
              >
                <option value="name-asc">Name A–Z</option>
                <option value="name-desc">Name Z–A</option>
                <option value="city-asc">City A–Z</option>
                <option value="city-desc">City Z–A</option>
              </select>
            </div>
          </div>

          {showFilters && (
            <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-slate-600">City</span>
                <select
                  value={cityFilter}
                  onChange={(e) => setCityFilter(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 text-sm focus:ring-2 focus:ring-sky-500/40 outline-none"
                >
                  <option value="all">All cities</option>
                  {cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setCityFilter("all");
                  }}
                  className="text-sm font-medium text-sky-600 hover:text-sky-700"
                >
                  Clear all
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        {filteredAndSorted.length > 0 ? (
          <>
            <p className="text-slate-600 mb-6">
              Showing {filteredAndSorted.length} of {results.length} {itemLabelPlural}
              {hasActiveFilters && " (filtered)"}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {filteredAndSorted.map((item) => (
                <VenueCard key={item.id} item={item} itemLabel={itemLabel} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-16 px-4">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-slate-100 text-slate-400 mb-6">
              <FiSearch className="w-10 h-10" />
            </div>
            <h2 className="text-xl font-semibold text-slate-800 mb-2">No results found</h2>
            <p className="text-slate-600 mb-6 max-w-sm mx-auto">{emptyMessage}</p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setCityFilter("all");
                setShowFilters(false);
              }}
              className="px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-medium transition-colors"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
