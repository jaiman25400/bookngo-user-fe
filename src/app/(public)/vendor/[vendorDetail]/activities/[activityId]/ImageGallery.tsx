"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { FiChevronLeft, FiChevronRight, FiX } from "react-icons/fi";

interface ImageGalleryProps {
  images: string[];
  activityName: string;
}

export default function ImageGallery({
  images,
  activityName,
}: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Handle keyboard navigation
  useEffect(() => {
    if (!isFullscreen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        handlePrevious();
      } else if (e.key === "ArrowRight") {
        handleNext();
      } else if (e.key === "Escape") {
        setIsFullscreen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen, currentIndex]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const openFullscreen = (index: number) => {
    setCurrentIndex(index);
    setIsFullscreen(true);
  };

  if (!images || images.length === 0) {
    return null;
  }

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";

  return (
    <>
      {/* Main Gallery - Clean Design */}
      <div className="relative w-full">
        {/* Main Large Image */}
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-gray-100 shadow-lg group">
          <Image
            src={`${baseUrl}${images[currentIndex]}`}
            alt={`${activityName} - Image ${currentIndex + 1}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 66vw"
            className="object-cover cursor-pointer transition-transform duration-300 group-hover:scale-105"
            priority
            quality={90}
            onClick={() => openFullscreen(currentIndex)}
          />
          
          {/* Navigation Arrows - Always Visible */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevious();
                }}
                className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-2 md:p-3 rounded-full transition-all backdrop-blur-sm z-10"
                aria-label="Previous image"
              >
                <FiChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-2 md:p-3 rounded-full transition-all backdrop-blur-sm z-10"
                aria-label="Next image"
              >
                <FiChevronRight className="w-5 h-5 md:w-6 md:h-6" />
              </button>
              
              {/* Image Counter - Bottom Right */}
              <div className="absolute bottom-3 md:bottom-4 right-3 md:right-4 bg-black/60 text-white px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-medium backdrop-blur-sm">
                {currentIndex + 1} / {images.length}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={() => setIsFullscreen(false)}
        >
          <button
            onClick={() => setIsFullscreen(false)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 p-2 rounded-full hover:bg-white/10 transition-colors z-10"
            aria-label="Close fullscreen"
          >
            <FiX className="w-8 h-8" />
          </button>

          <div
            className="relative max-w-7xl w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Main Fullscreen Image */}
            <div className="relative w-full h-full max-h-[90vh]">
              <Image
                src={`${baseUrl}${images[currentIndex]}`}
                alt={`${activityName} - Image ${currentIndex + 1}`}
                fill
                sizes="100vw"
                className="object-contain"
                quality={95}
              />
            </div>

            {/* Navigation Arrows in Fullscreen */}
            {images.length > 1 && (
              <>
                <button
                  onClick={handlePrevious}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-4 rounded-full transition-all backdrop-blur-sm"
                  aria-label="Previous image"
                >
                  <FiChevronLeft className="w-8 h-8" />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-4 rounded-full transition-all backdrop-blur-sm"
                  aria-label="Next image"
                >
                  <FiChevronRight className="w-8 h-8" />
                </button>

                {/* Image Counter in Fullscreen */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-black/50 text-white px-6 py-3 rounded-full text-lg font-medium backdrop-blur-sm">
                  {currentIndex + 1} / {images.length}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
