"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, type ReactNode } from "react";
import {
  FiArrowRight,
  FiInfo,
  FiPhone,
  FiMapPin,
  FiCompass,
  FiDisc,
} from "react-icons/fi";
import NewsletterForm from "../../components/NewsletterForm";
import HomeVendorSearch from "../../components/HomeVendorSearch";
import HeroWinterBackground from "../../components/HeroWinterBackground";
import type { ListingFrom } from "../(public)/lib/listingContext";

type FeaturedDestination = {
  name: string;
  location: string;
  href: string;
  type: string;
  icon: ReactNode;
  image: string;
  tall?: boolean;
};

const FEATURED_DESTINATIONS: FeaturedDestination[] = [
  {
    name: "Blue Mountain Resort",
    location: "Ontario",
    href: "/Ontario",
    type: "Ski Resort",
    icon: <FiCompass className="h-3.5 w-3.5" />,
    image:
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80",
    tall: true,
  },
  {
    name: "Ontario Ski Escapes",
    location: "Ontario",
    href: "/Ontario",
    type: "Ski Resort",
    icon: <FiCompass className="h-3.5 w-3.5" />,
    image:
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Rideau Canal Skateway",
    location: "Ontario",
    href: "/vendor/rideau-canal-skateway?from=skates",
    type: "Skating Rink",
    icon: <FiDisc className="h-3.5 w-3.5" />,
    image:
      "https://images.unsplash.com/photo-1517299321609-52687d1bc55a?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Rink of Dreams",
    location: "Ontario",
    href: "/vendor/rink-of-dreams?from=skates",
    type: "Skating Rink",
    icon: <FiDisc className="h-3.5 w-3.5" />,
    image:
      "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "The Bentway",
    location: "Ontario",
    href: "/vendor/the-bentway?from=skates",
    type: "Skating Rink",
    icon: <FiDisc className="h-3.5 w-3.5" />,
    image:
      "https://images.unsplash.com/photo-1503435980610-a51f3ddfee50?auto=format&fit=crop&w=800&q=80",
  },
];

const REGION_CARDS = [
  {
    name: "Ontario",
    skiBadge: "12 resorts",
    skateBadge: "29 rinks",
    image:
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1000&q=80",
    skiHref: "/Ontario",
    skateHref: "/skates/Ontario",
  },
  {
    name: "Quebec",
    skiBadge: "18 resorts",
    skateBadge: "28 rinks",
    image:
      "https://images.unsplash.com/photo-1503435980610-a51f3ddfee50?auto=format&fit=crop&w=1000&q=80",
    skiHref: "/Quebec",
    skateHref: "/skates/Quebec",
  },
  {
    name: "British Columbia",
    skiBadge: "9 resorts",
    skateBadge: "19 rinks",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80",
    skiHref: "/British-Columbia",
    skateHref: "/skates/British-Columbia",
  },
  {
    name: "Manitoba",
    skiBadge: "7 resorts",
    skateBadge: "15 rinks",
    image:
      "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1000&q=80",
    skiHref: "/Manitoba",
    skateHref: "/skates/Manitoba",
  },
  {
    name: "New Brunswick",
    skiBadge: "4 resorts",
    skateBadge: "8 rinks",
    image:
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1000&q=80",
    skiHref: "/New-Brunswick",
    skateHref: "/skates/New-Brunswick",
  },
  {
    name: "Nova Scotia",
    skiBadge: "3 resorts",
    skateBadge: "6 rinks",
    image:
      "https://images.unsplash.com/photo-1521185496955-15097b20c5fe?auto=format&fit=crop&w=1000&q=80",
    skiHref: "/Nova-Scotia",
    skateHref: "/skates/Nova-Scotia",
  },
] as const;

export default function HomePage() {
  const [regionMode, setRegionMode] = useState<ListingFrom>("skiing");

  const heroSearchPlaceholder = "Search resort or skating rink by name...";

  const regionCards = useMemo(
    () =>
      REGION_CARDS.map((region) => ({
        ...region,
        href: regionMode === "skiing" ? region.skiHref : region.skateHref,
        badge: regionMode === "skiing" ? region.skiBadge : region.skateBadge,
      })),
    [regionMode],
  );

  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-[#0d1b2a] pt-24 pb-20 text-center text-white">
        <HeroWinterBackground />
        <div className="absolute inset-0 opacity-60">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_70%,rgba(95,176,229,0.22),transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_75%_20%,rgba(95,176,229,0.18),transparent_55%)]" />
        </div>
        <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-sky-300/30 bg-sky-300/10 px-4 py-1.5 text-xs uppercase tracking-wide text-sky-200">
            <span>❄</span> Canada&apos;s winter activity platform
          </div>
          <h1 className="mx-auto max-w-3xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl">
            Book Your Winter Adventure
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base text-slate-300 sm:text-lg">
            Discover ski resorts and skating rinks across Canada, all in one place.
          </p>
          <div className="mx-auto mt-10 max-w-2xl rounded-2xl border border-white/15 bg-white/10 p-4 sm:p-6 backdrop-blur">
            <HomeVendorSearch placeholder={heroSearchPlaceholder} />
          </div>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/skiing"
              className="inline-flex items-center rounded-full bg-sky-300 px-5 py-2.5 text-sm font-semibold text-slate-900 transition hover:opacity-90"
            >
              Browse ski resorts <FiArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              href="/skates"
              className="inline-flex items-center rounded-full border border-white/25 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/20"
            >
              Browse skating rinks <FiArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-slate-200 bg-white py-6">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 text-center sm:grid-cols-4 sm:px-6">
          {[
            { value: "50+", label: "Ski resorts" },
            { value: "120+", label: "Skating rinks" },
            { value: "9", label: "Provinces covered" },
            { value: "Free", label: "Always free to browse" },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              <p className="mt-1 text-xs text-slate-500 sm:text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="bg-white py-14 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-8 text-center">
            <p className="mb-3 inline-block rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-sky-800">
              Ontario highlights
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Featured destinations</h2>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {FEATURED_DESTINATIONS.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`group relative overflow-hidden rounded-2xl bg-slate-900 ${
                  item.tall ? "md:row-span-2 min-h-[420px]" : "min-h-[200px]"
                }`}
              >
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover opacity-60 transition group-hover:scale-105 group-hover:opacity-50"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-900/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                  <span className="mb-2 inline-flex items-center gap-1 rounded-full border border-sky-300/30 bg-sky-300/15 px-2.5 py-1 text-xs text-sky-100">
                    {item.icon}
                    {item.type}
                  </span>
                  <h3 className="text-xl font-semibold tracking-tight">{item.name}</h3>
                  <p className="mt-1 flex items-center text-sm text-slate-200">
                    <FiMapPin className="mr-1.5 h-3.5 w-3.5" />
                    {item.location}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Region explorer */}
      <section className="bg-slate-50 py-14 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-8 text-center">
            <p className="mb-3 inline-block rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-sky-800">
              Explore by province
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Find venues near you</h2>
            <p className="mt-2 text-slate-600">Browse ski resorts and skating rinks in your province.</p>
          </div>
          <div className="mb-8 flex items-center justify-center">
            <div className="inline-flex rounded-full border border-slate-200 bg-white p-1 shadow-sm">
              <button
                type="button"
                onClick={() => setRegionMode("skiing")}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                  regionMode === "skiing"
                    ? "bg-[#0d1b2a] text-white"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                ⛷ Ski Resorts
              </button>
              <button
                type="button"
                onClick={() => setRegionMode("skates")}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                  regionMode === "skates"
                    ? "bg-[#0d1b2a] text-white"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                ⛸ Skating Rinks
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {regionCards.map((region) => (
              <Link
                href={region.href}
                key={region.name}
                className="group relative block overflow-hidden rounded-xl bg-slate-900"
              >
                <Image
                  src={region.image}
                  alt={region.name}
                  width={640}
                  height={460}
                  className="h-52 w-full object-cover opacity-60 transition group-hover:scale-105 group-hover:opacity-50"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-900/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                  <p className="text-lg font-semibold">{region.name}</p>
                  <p className="mt-1 inline-flex rounded-full border border-white/30 bg-white/15 px-3 py-1 text-xs font-semibold">
                    {regionMode === "skiing" ? "⛷" : "⛸"} {region.badge}
                  </p>
                  <p className="mt-2 text-sm text-slate-200">Explore →</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-[#0d1b2a] py-14 text-white">
        <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
          <p className="mb-3 inline-block rounded-full bg-sky-300/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-sky-200">
            Stay in the loop
          </p>
          <h2 className="text-3xl font-bold tracking-tight">Fresh snow alerts, delivered</h2>
          <p className="mx-auto mt-3 max-w-lg text-slate-300">
            Get updates on new resorts, ice conditions, and seasonal deals before anyone else.
          </p>
          <div className="mt-8">
            <NewsletterForm />
          </div>
        </div>
      </section>

      {/* Partner cards */}
      <section className="border-t border-slate-200 bg-slate-50 py-12 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Link
              href="/about"
              className="group rounded-2xl border border-slate-200 bg-white p-6 transition hover:shadow-lg"
              aria-label="About Us"
            >
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-slate-50">
                <FiInfo className="h-5 w-5 text-slate-700" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-slate-900 sm:text-2xl">
                Our goal is to help more people enjoy winter outdoors.
              </h3>
              <p className="mb-5 text-slate-600">
                Easily discover and book trusted ski resorts and skating rinks
                across Canada. Whether it is your first season or you are a
                long-time winter enthusiast, we help you find a destination
                that matches your style.
              </p>
              <span className="inline-flex items-center font-semibold text-sky-700">
                Learn about us
                <FiArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
            <Link
              href="/contact"
              className="group rounded-2xl border border-slate-200 bg-white p-6 transition hover:shadow-lg"
              aria-label="Contact Us"
            >
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-slate-50">
                <FiPhone className="h-5 w-5 text-slate-700" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-slate-900 sm:text-2xl">
                Are you a resort or skating venue owner?
              </h3>
              <p className="mb-5 text-slate-600">
                BookNGo can help you grow your business with online visibility,
                better booking flow, and customer support tools. Contact us to
                discuss partnership and onboarding.
              </p>
              <span className="inline-flex items-center font-semibold text-sky-700">
                Contact us
                <FiArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
