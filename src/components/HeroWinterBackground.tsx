"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

const SLIDESHOW_INTERVAL_MS = 3800;

const WINTER_HERO_IMAGES = [
  {
    src: "https://images.unsplash.com/photo-1483664852095-d6cc6870702d?auto=format&fit=crop&w=2400&q=80",
    alt: "Snowy mountain landscape at sunrise",
  },
  {
    src: "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=2400&q=80",
    alt: "Pine forest covered in fresh winter snow",
  },
  {
    src: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=2400&q=80",
    alt: "Winter valley with mountains and fog",
  },
  {
    src: "https://images.unsplash.com/photo-1517299321609-52687d1bc55a?auto=format&fit=crop&w=2400&q=80",
    alt: "Frozen lake and snowy hills under soft light",
  },
] as const;

export default function HeroWinterBackground() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [preloaded, setPreloaded] = useState<boolean[]>(
    WINTER_HERO_IMAGES.map((_, index) => index === 0)
  );

  useEffect(() => {
    WINTER_HERO_IMAGES.forEach((image, index) => {
      if (index === 0) return;
      const img = new window.Image();
      img.src = image.src;
      img.onload = () => {
        setPreloaded((prev) => {
          if (prev[index]) return prev;
          const next = [...prev];
          next[index] = true;
          return next;
        });
      };
    });
  }, []);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveIndex((prev) => {
        const nextIndex = (prev + 1) % WINTER_HERO_IMAGES.length;
        return preloaded[nextIndex] ? nextIndex : prev;
      });
    }, SLIDESHOW_INTERVAL_MS);

    return () => window.clearInterval(intervalId);
  }, [preloaded]);

  const dots = useMemo(
    () =>
      WINTER_HERO_IMAGES.map((_, index) => (
        <span
          key={index}
          className={`h-1.5 w-6 rounded-full transition-all duration-500 ${
            index === activeIndex ? "bg-white/90" : "bg-white/35"
          }`}
        />
      )),
    [activeIndex]
  );

  return (
    <div className="fixed inset-0 -z-50 overflow-hidden" aria-hidden="true">
      {WINTER_HERO_IMAGES.map((image, index) => {
        const isActive = index === activeIndex;

        return (
          <div
            key={image.src}
            className={`absolute inset-0 transition-opacity duration-[1500ms] ease-in-out ${
              isActive ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              priority={index === 0}
              loading="eager"
              className={`object-cover will-change-transform ${
                isActive ? "animate-heroKenBurns" : ""
              }`}
              quality={90}
              sizes="100vw"
              onLoad={() => {
                setPreloaded((prev) => {
                  if (prev[index]) return prev;
                  const next = [...prev];
                  next[index] = true;
                  return next;
                });
              }}
            />
          </div>
        );
      })}

      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/45 to-black/60" />
      <div className="snow-overlay" />

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
        {dots}
      </div>
    </div>
  );
}
