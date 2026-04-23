"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiMapPin, FiSearch, FiChevronRight } from "react-icons/fi";
import { apiImageUrl } from "@/app/(public)/lib/apiImageUrl";
import { vendorPath, type ListingFrom } from "@/app/(public)/lib/listingContext";
import { fetchSkiingData } from "@/app/(public)/skiing/skiingApi";
import { fetchSkatingData } from "@/app/(public)/skates/skatingApi";

const MAX_RESULTS = 12;
const MIN_CHARS = 2;

type MergedVendor = {
  slug: string;
  name: string;
  city: string;
  kind: ListingFrom;
  imageKey: string | null | undefined;
};

function normalize(s: string) {
  return s.toLowerCase().replace(/\s+/g, " ").trim();
}

/** Every whitespace-separated token must appear somewhere in name or city (e.g. "boler mountain" matches "Boler Mountain Ski Resort"). */
function matchesTokens(name: string, city: string, query: string): boolean {
  const tokens = normalize(query).split(" ").filter(Boolean);
  if (!tokens.length) return false;
  const hay = normalize(`${name} ${city}`);
  return tokens.every((t) => hay.includes(t));
}

function matchScore(name: string, city: string, query: string): number {
  const n = normalize(name);
  const q = normalize(query);
  if (!q) return 99;
  if (n.startsWith(q)) return 0;
  if (n.includes(q)) return 1;
  if (normalize(city).includes(q.split(" ")[0] || q)) return 2;
  return 3;
}

export default function HomeVendorSearch() {
  const router = useRouter();
  const [vendors, setVendors] = useState<MergedVendor[]>([]);
  const [loadState, setLoadState] = useState<"idle" | "loading" | "ready" | "error">(
    "idle"
  );
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const wrapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoadState("loading");
      const [ski, skate] = await Promise.all([
        fetchSkiingData(),
        fetchSkatingData(),
      ]);
      if (cancelled) return;
      if (ski.error && skate.error) {
        setLoadState("error");
        return;
      }
      const merged: MergedVendor[] = [];
      if (ski.data) {
        for (const a of ski.data) {
          merged.push({
            slug: a.slug,
            name: a.name,
            city: a.city,
            kind: "skiing",
            imageKey: a.customer_image,
          });
        }
      }
      if (skate.data) {
        for (const v of skate.data) {
          merged.push({
            slug: v.slug,
            name: v.name,
            city: v.city,
            kind: "skates",
            imageKey: v.customer_image,
          });
        }
      }
      merged.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" }));
      setVendors(merged);
      setLoadState("ready");
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const trimmedQuery = query.trim();
  const filtered = useMemo(() => {
    if (trimmedQuery.length < MIN_CHARS) return [];
    return vendors
      .filter((v) => matchesTokens(v.name, v.city, trimmedQuery))
      .sort(
        (a, b) =>
          matchScore(a.name, a.city, trimmedQuery) -
            matchScore(b.name, b.city, trimmedQuery) ||
          a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
      )
      .slice(0, MAX_RESULTS);
  }, [vendors, trimmedQuery]);

  useEffect(() => {
    setActiveIndex(-1);
  }, [trimmedQuery, filtered.length]);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const showPanel =
    open &&
    trimmedQuery.length >= MIN_CHARS &&
    (loadState === "ready" || loadState === "loading");

  const onKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
      if (!showPanel || !filtered.length) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => (i + 1) % filtered.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => (i <= 0 ? filtered.length - 1 : i - 1));
      } else if (e.key === "Enter") {
        const pick =
          activeIndex >= 0 ? filtered[activeIndex] : filtered[0];
        if (pick) {
          e.preventDefault();
          router.push(vendorPath(pick.slug, pick.kind));
        }
      }
    },
    [showPanel, filtered, activeIndex, router]
  );

  const kindLabel = (k: ListingFrom) =>
    k === "skiing" ? "Ski resort" : "Skating rink";

  return (
    <div ref={wrapRef} className="w-full max-w-xl mx-auto text-left">
      <label htmlFor="home-vendor-search" className="sr-only">
        Search for a resort or skating venue by name
      </label>
      <div className="relative">
        <FiSearch
          className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 pointer-events-none"
          aria-hidden
        />
        <input
          ref={inputRef}
          id="home-vendor-search"
          type="search"
          autoComplete="off"
          placeholder="Search by venue name (e.g. Boler Mountain)…"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          disabled={loadState === "loading" || loadState === "idle"}
          className="w-full pl-12 pr-4 py-3.5 sm:py-4 rounded-2xl bg-white/95 text-slate-900 placeholder:text-slate-500 border border-white/40 shadow-lg focus:outline-none focus:ring-2 focus:ring-sky-400/80 focus:border-transparent backdrop-blur-sm text-base disabled:opacity-70"
          aria-autocomplete="list"
          aria-controls="home-vendor-search-list"
        />
      </div>

      {loadState === "error" && (
        <p className="mt-2 text-sm text-amber-100 drop-shadow px-1">
          Search is temporarily unavailable. Use{" "}
          <Link href="/skiing" className="underline font-medium text-white">
            Ski slopes
          </Link>{" "}
          or{" "}
          <Link href="/skates" className="underline font-medium text-white">
            Skating rinks
          </Link>{" "}
          to browse.
        </p>
      )}

      {showPanel && (
        <div
          id="home-vendor-search-list"
          role="listbox"
          className="mt-2 rounded-2xl border border-white/20 bg-slate-950/90 backdrop-blur-md shadow-2xl overflow-hidden max-h-[min(70vh,22rem)] flex flex-col"
        >
          {loadState === "loading" && (
            <div className="px-4 py-6 text-center text-sm text-white/80">
              Loading venues…
            </div>
          )}
          {loadState === "ready" && filtered.length === 0 && (
            <div className="px-4 py-5 text-sm text-white/90">
              <p className="font-medium text-white mb-2">No venues match that search.</p>
              <p className="text-white/75 mb-3">
                Try another spelling, or browse full lists — you&apos;ll see photos and
                filters there.
              </p>
              <div className="flex flex-wrap gap-2">
                <Link
                  href="/skiing"
                  className="inline-flex items-center rounded-lg bg-white/15 hover:bg-white/25 px-3 py-2 text-xs font-semibold text-white transition-colors"
                >
                  All ski resorts
                  <FiChevronRight className="ml-1 w-3.5 h-3.5" />
                </Link>
                <Link
                  href="/skates"
                  className="inline-flex items-center rounded-lg bg-white/15 hover:bg-white/25 px-3 py-2 text-xs font-semibold text-white transition-colors"
                >
                  All skating rinks
                  <FiChevronRight className="ml-1 w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}
          {loadState === "ready" && filtered.length > 0 && (
            <>
              <p className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-white/50 border-b border-white/10 shrink-0">
                {filtered.length} found
                {filtered.length >= MAX_RESULTS ? " — showing top matches" : ""}
              </p>
              <ul className="overflow-y-auto overscroll-contain min-h-0 divide-y divide-white/10">
                {filtered.map((v, index) => {
                  const href = vendorPath(v.slug, v.kind);
                  const img = apiImageUrl(v.imageKey ?? null);
                  const active = index === activeIndex;
                  return (
                    <li key={`${v.kind}-${v.slug}`} role="option" aria-selected={active}>
                      <Link
                        href={href}
                        className={`flex items-center gap-3 px-3 py-2.5 sm:py-3 transition-colors ${
                          active ? "bg-white/15" : "hover:bg-white/10"
                        }`}
                        onMouseEnter={() => setActiveIndex(index)}
                      >
                        <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden bg-slate-800 shrink-0 border border-white/10">
                          {img ? (
                            <Image
                              src={img}
                              alt=""
                              fill
                              className="object-cover"
                              sizes="56px"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-lg">
                              {v.kind === "skiing" ? "⛷️" : "⛸️"}
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-white text-sm sm:text-base truncate">
                            {v.name}
                          </p>
                          <p className="flex items-center gap-1 text-xs sm:text-sm text-white/70 mt-0.5 truncate">
                            <FiMapPin className="w-3.5 h-3.5 shrink-0 text-sky-300" />
                            <span className="truncate">{v.city}</span>
                            <span className="text-white/40 mx-1">·</span>
                            <span className="shrink-0 text-white/60">
                              {kindLabel(v.kind)}
                            </span>
                          </p>
                        </div>
                        <FiChevronRight className="w-5 h-5 text-white/40 shrink-0" />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </>
          )}
        </div>
      )}

      <p className="mt-2 text-center text-xs text-white/75 px-1">
        Tip: type at least {MIN_CHARS} characters. Matches work across ski and skating
        partners.
      </p>
    </div>
  );
}
