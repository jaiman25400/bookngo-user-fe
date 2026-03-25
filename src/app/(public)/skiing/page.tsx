"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { apiImageUrl } from "../lib/apiImageUrl";
import { vendorPath } from "../lib/listingContext";
import { fetchSkiingData, type SkiArea } from "./skiingApi";
import {
  FiMapPin,
  FiSearch,
  FiX,
  FiAlertCircle,
  FiExternalLink,
  FiChevronRight,
} from "react-icons/fi";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

// High-quality Mapbox style: satellite with streets (premium look)
const MAP_STYLE = "mapbox://styles/mapbox/satellite-streets-v12";

const SkiingPage = () => {
  const router = useRouter();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [skiAreas, setSkiAreas] = useState<SkiArea[]>([]);
  const [filteredAreas, setFilteredAreas] = useState<SkiArea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedArea, setSelectedArea] = useState<SkiArea | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [hoveredArea, setHoveredArea] = useState<SkiArea | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number } | null>(null);
  const hoveredAreaRef = useRef<SkiArea | null>(null);
  const [mobileView, setMobileView] = useState<"list" | "map">("list");

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const { data, error } = await fetchSkiingData();
        if (error) throw new Error(error);
        if (data) {
          setSkiAreas(data);
          setFilteredAreas(data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredAreas(skiAreas);
      return;
    }
    const query = searchQuery.toLowerCase();
    const filtered = skiAreas.filter(
      (area) =>
        area.name.toLowerCase().includes(query) ||
        area.city.toLowerCase().includes(query)
    );
    setFilteredAreas(filtered);
  }, [searchQuery, skiAreas]);

  // Initialize map with premium style and interactive markers
  useEffect(() => {
    if (!mapContainer.current || !skiAreas.length || map.current) return;

    // Focus on Canada: center on Ontario, zoom in so max ~10% of view is USA
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: MAP_STYLE,
      center: [-79.4, 44.8],
      zoom: 6.2,
      maxBounds: [
        [-130, 41.5],
        [-50, 72],
      ],
      attributionControl: false,
    });

    // Remove orange road lines + try to start at user's location (not fixed Ontario)
    const flyToUserLocation = (lng: number, lat: number) => {
      map.current?.flyTo({
        center: [lng, lat],
        zoom: 8,
        duration: 1500,
        essential: true,
      });
    };

    map.current.on("load", () => {
      const style = map.current?.getStyle();
      if (style?.layers) {
        for (const layer of style.layers) {
          const id = layer.id.toLowerCase();
          const isRoadLine =
            layer.type === "line" &&
            (id.includes("road") ||
              id.includes("street") ||
              id.includes("highway") ||
              id.includes("bridge"));
          if (isRoadLine) {
            map.current?.setLayoutProperty(layer.id, "visibility", "none");
          }
        }
      }
      setMapLoaded(true);

      // Ask for location and show user's city (whole city, not exact home)
      if (typeof navigator !== "undefined" && navigator.geolocation && process.env.NEXT_PUBLIC_MAPBOX_TOKEN) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const lng = pos.coords.longitude;
            const lat = pos.coords.latitude;
            const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
            if (!token || !map.current) return;
            fetch(
              `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?types=place,locality&limit=5&access_token=${token}`
            )
              .then((r) => r.json())
              .then((data: { features?: Array<{ place_type?: string[]; bbox?: number[]; center?: number[] }> }) => {
                const features = data.features || [];
                const city = features.find(
                  (f) => f.place_type?.includes("place") || f.place_type?.includes("locality")
                ) || features[0];
                if (!city || !map.current) return;
                if (city.bbox && city.bbox.length >= 4) {
                  map.current.fitBounds(
                    [[city.bbox[0], city.bbox[1]], [city.bbox[2], city.bbox[3]]],
                    { padding: 48, maxZoom: 12, duration: 1200 }
                  );
                } else if (city.center && city.center.length >= 2) {
                  map.current.flyTo({
                    center: [city.center[0], city.center[1]],
                    zoom: 11,
                    duration: 1200,
                    essential: true,
                  });
                }
              })
              .catch(() => {});
          },
          () => {},
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
        );
      }
    });

    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");
    map.current.addControl(new mapboxgl.FullscreenControl(), "top-right");
    // Location button: zoom to user's location when they click
    const geolocate = new mapboxgl.GeolocateControl({
      positionOptions: { enableHighAccuracy: true },
      trackUserLocation: true,
      showUserHeading: false,
      fitBoundsOptions: { maxZoom: 16 },
    });
    geolocate.on("geolocate", (e: GeolocationPosition) => {
      const { longitude, latitude } = e.coords;
      // Run after control's own fit so we override and zoom in close
      setTimeout(() => flyToUserLocation(longitude, latitude), 100);
    });
    map.current.addControl(geolocate, "top-right");

    const updateTooltipPosition = () => {
      if (hoveredAreaRef.current && map.current) {
        const p = map.current.project([
          hoveredAreaRef.current.longitude,
          hoveredAreaRef.current.latitude,
        ]);
        setTooltipPosition({ x: p.x, y: p.y });
      }
    };
    map.current.on("move", updateTooltipPosition);
    map.current.on("moveend", updateTooltipPosition);

    skiAreas.forEach((area) => {
      const pin = document.createElement("div");
      pin.className = "ski-marker-pin";
      pin.setAttribute("aria-hidden", "true");
      pin.setAttribute("aria-label", `${area.name}, ${area.city}`);
      pin.textContent = "⛷️";

      pin.addEventListener("mouseenter", () => {
        pin.classList.add("ski-marker-pin-hover");
        hoveredAreaRef.current = area;
        setHoveredArea(area);
        if (map.current) {
          const p = map.current.project([area.longitude, area.latitude]);
          setTooltipPosition({ x: p.x, y: p.y });
        }
      });
      pin.addEventListener("mouseleave", () => {
        pin.classList.remove("ski-marker-pin-hover");
        hoveredAreaRef.current = null;
        setHoveredArea(null);
        setTooltipPosition(null);
      });
      pin.addEventListener("click", (e) => {
        e.stopPropagation();
        e.preventDefault();
        router.push(vendorPath(area.slug, "skiing"));
      });

      const marker = new mapboxgl.Marker({ element: pin, anchor: "center" })
        .setLngLat([area.longitude, area.latitude])
        .addTo(map.current!);

      markersRef.current.push(marker);
    });

    return () => {
      map.current?.off("move", updateTooltipPosition);
      map.current?.off("moveend", updateTooltipPosition);
      hoveredAreaRef.current = null;
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      map.current?.remove();
      map.current = null;
      setMapLoaded(false);
    };
  }, [skiAreas, router]);

  // Resize map after switching to mobile map view
  useEffect(() => {
    if (mobileView !== "map" || !map.current) return;
    const t = setTimeout(() => {
      map.current?.resize();
    }, 100);
    return () => clearTimeout(t);
  }, [mobileView]);

  // List item click: fly to location and highlight (do not redirect)
  const handleAreaClick = useCallback((area: SkiArea) => {
    setSelectedArea(area);

    // On mobile, switch to map view when a resort is selected
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      setMobileView("map");
    }

    if (map.current) {
      map.current.flyTo({
        center: [area.longitude, area.latitude],
        zoom: 11,
        duration: 1200,
        essential: true,
      });
      hoveredAreaRef.current = area;
      setHoveredArea(area);
      const p = map.current.project([area.longitude, area.latitude]);
      setTooltipPosition({ x: p.x, y: p.y });
      setTimeout(() => {
        hoveredAreaRef.current = null;
        setHoveredArea(null);
        setTooltipPosition(null);
      }, 2500);
    }
  }, []);

  const handleViewResort = useCallback(
    (area: SkiArea) => {
      router.push(vendorPath(area.slug, "skiing"));
    },
    [router]
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full border-2 border-sky-200" />
            <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-sky-500 animate-spin" />
            <FiMapPin className="absolute inset-0 m-auto w-8 h-8 text-sky-500" />
          </div>
          <p className="text-slate-700 text-lg font-medium">Loading ski resorts...</p>
          <p className="text-slate-500 text-sm mt-1">Finding the best slopes for you</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="max-w-md w-full text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-red-50 border border-red-200 mb-6">
            <FiAlertCircle className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Error Loading Resorts</h2>
          <p className="text-slate-600 mb-8">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-8 py-3.5 bg-sky-500 hover:bg-sky-600 text-white font-semibold rounded-xl transition-all shadow-lg shadow-sky-500/25"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen lg:h-screen bg-slate-50 flex-col lg:flex-row lg:overflow-hidden">
      {/* Left column: header + list (wrapper uses contents on mobile so map can sit between them via order) */}
      <div className="contents lg:flex lg:flex-col lg:w-[480px] xl:w-[540px] lg:h-full lg:flex-shrink-0 lg:bg-white lg:border-r lg:border-slate-200 lg:shadow-xl">
        {/* Header + search + toggle */}
        <div className="order-1 lg:order-1 w-full bg-white border-r border-slate-200 shadow-xl lg:shadow-none flex flex-col flex-shrink-0">
          <div className="p-6 pb-5 border-b border-slate-100 bg-gradient-to-br from-sky-500 to-blue-600">
          <div className="flex items-center gap-3 mb-1">
            <span className="text-sky-100 font-semibold text-sm uppercase tracking-wider">Ski & Snow</span>
          </div>
          <h1 className="text-3xl xl:text-4xl font-bold text-white tracking-tight">
            Find Your Slopes
          </h1>
          <p className="text-white/90 mt-2 text-sm">
            {skiAreas.length} resort{skiAreas.length !== 1 ? "s" : ""} across Canada — hover ski icons for details, click to visit
          </p>
          </div>

          {/* Search */}
          <div className="p-4 border-b border-slate-100 bg-slate-50/50">
          <div className="relative group">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-sky-500 transition-colors" />
            <input
              type="text"
              placeholder="Search by resort or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-12 py-3.5 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-sky-500/40 focus:border-sky-400 outline-none transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <FiX className="w-5 h-5" />
              </button>
            )}
          </div>
          {searchQuery && (
            <p className="mt-2 text-sm text-slate-500">
              {filteredAreas.length} result{filteredAreas.length !== 1 ? "s" : ""}
            </p>
          )}

          {/* Mobile view toggle */}
          <div className="mt-3 flex items-center justify-between lg:hidden">
            <div className="inline-flex rounded-full bg-slate-100 p-1">
              <button
                type="button"
                onClick={() => setMobileView("list")}
                className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
                  mobileView === "list"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                List view
              </button>
              <button
                type="button"
                onClick={() => setMobileView("map")}
                className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
                  mobileView === "map"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
                disabled={!process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
              >
                Map view
              </button>
            </div>
          </div>
        </div>
        </div>

        {/* List */}
        <div className="order-3 lg:order-2 flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar bg-white min-h-0">
          {filteredAreas.length > 0 ? (
            <div className="p-4 space-y-4">
              {filteredAreas.map((area) => {
                const areaImageUrl = apiImageUrl(area.customer_image);
                return (
                <div
                  key={area.slug}
                  className={`group relative rounded-2xl border-2 overflow-hidden transition-all duration-300 cursor-pointer ${
                    selectedArea?.slug === area.slug
                      ? "border-sky-400 shadow-lg shadow-sky-500/15 ring-2 ring-sky-400/30"
                      : "border-slate-200 hover:border-sky-300 bg-white hover:shadow-md"
                  }`}
                  onClick={() => handleAreaClick(area)}
                >
                  <div className="relative h-44 w-full overflow-hidden">
                    {areaImageUrl ? (
                    <Image
                      src={areaImageUrl}
                      alt={area.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 1024px) 100vw, 540px"
                      loading="lazy"
                      quality={85}
                    />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-sky-100 to-blue-100 text-sky-600">
                        <span className="text-4xl">🏔️</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/10 to-transparent" />
                    <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-white drop-shadow-lg line-clamp-1">
                          {area.name}
                        </h3>
                        <p className="flex items-center text-slate-200 text-sm mt-0.5">
                          <FiMapPin className="w-3.5 h-3.5 mr-1.5 text-sky-300 flex-shrink-0" />
                          <span className="line-clamp-1">{area.city}</span>
                        </p>
                      </div>
                      <span className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20 backdrop-blur text-white group-hover:bg-sky-400 transition-all">
                        <FiChevronRight className="w-5 h-5" />
                      </span>
                    </div>
                  </div>
                  <div className="p-3 flex items-center justify-between bg-slate-50 border-t border-slate-100">
                    <span className="text-slate-500 text-sm">Click to locate on map</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewResort(area);
                      }}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-sky-500/10 text-sky-600 hover:bg-sky-500 hover:text-white font-medium text-sm transition-all"
                    >
                      View resort
                      <FiExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center min-h-[280px] p-8 text-center">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                <FiSearch className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">No resorts found</h3>
              <p className="text-slate-500 mb-6">Try a different search term</p>
              <button
                onClick={() => setSearchQuery("")}
                className="px-5 py-2.5 text-sky-600 hover:text-sky-700 font-medium rounded-xl border border-sky-300 hover:border-sky-400 transition-colors"
              >
                Clear search
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Single map container: order-2 on mobile, right column on desktop */}
      <div
        className={`order-2 min-h-[280px] px-4 py-4 lg:px-0 lg:py-0 lg:min-h-0 lg:flex-1 lg:relative ${
          mobileView === "map" ? "block" : "hidden lg:!block"
        }`}
      >
        <div className="h-full min-h-[256px] lg:min-h-0 rounded-2xl overflow-hidden border border-sky-200 shadow-md bg-slate-100 lg:rounded-none lg:border-0 lg:border-l-4 lg:shadow-inner relative">
          <div
            ref={mapContainer}
            className="w-full h-full min-h-[256px] lg:min-h-0 bg-slate-200"
          />
        {process.env.NEXT_PUBLIC_MAPBOX_TOKEN && mapLoaded && (
          <div className="absolute inset-0 pointer-events-none rounded-none lg:rounded-l-2xl">
            {hoveredArea && tooltipPosition && (
              <div
                className="ski-marker-tooltip ski-marker-tooltip-visible absolute"
                style={{
                  left: tooltipPosition.x,
                  top: tooltipPosition.y,
                  transform: "translate(-50%, -100%) translateY(-8px)",
                }}
                role="tooltip"
              >
                <span className="ski-marker-tooltip-title">{hoveredArea.name}</span>
                <span className="ski-marker-tooltip-city">{hoveredArea.city}</span>
                <span className="ski-marker-tooltip-hint">Click to view resort</span>
              </div>
            )}
          </div>
        )}
        {process.env.NEXT_PUBLIC_MAPBOX_TOKEN && !mapLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-100 rounded-none lg:rounded-l-2xl">
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-2 border-sky-200 border-t-sky-600 rounded-full animate-spin" />
              <p className="text-slate-600 text-sm font-medium">Loading map...</p>
            </div>
          </div>
        )}
        {!process.env.NEXT_PUBLIC_MAPBOX_TOKEN && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
            <div className="text-center p-8 max-w-sm">
              <div className="w-20 h-20 rounded-2xl bg-slate-200 flex items-center justify-center mx-auto mb-4">
                <FiMapPin className="w-10 h-10 text-slate-400" />
              </div>
              <p className="text-slate-600 font-medium">Mapbox token not configured</p>
              <p className="text-slate-500 text-sm mt-1">Add NEXT_PUBLIC_MAPBOX_TOKEN to enable the map</p>
            </div>
          </div>
        )}
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #bae6fd;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #7dd3fc;
        }

        .ski-marker-pin {
          cursor: pointer;
        }

        .ski-marker-tooltip {
          position: absolute;
          padding: 10px 14px;
          min-width: 160px;
          max-width: 220px;
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(14, 165, 233, 0.35);
          border-radius: 12px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.12);
          opacity: 0;
          visibility: hidden;
          transition: opacity 0.2s ease, visibility 0.2s ease;
          pointer-events: none;
          white-space: nowrap;
          z-index: 10;
        }
        .ski-marker-tooltip::after {
          content: "";
          position: absolute;
          top: 100%;
          left: 50%;
          margin-left: -6px;
          border: 6px solid transparent;
          border-top-color: rgba(14, 165, 233, 0.35);
        }
        .ski-marker-tooltip-visible {
          opacity: 1;
          visibility: visible;
        }
        .ski-marker-tooltip-title {
          display: block;
          font-size: 14px;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 2px;
          white-space: normal;
          line-height: 1.3;
        }
        .ski-marker-tooltip-city {
          display: block;
          font-size: 12px;
          color: #64748b;
          margin-bottom: 6px;
        }
        .ski-marker-tooltip-hint {
          display: block;
          font-size: 10px;
          color: #0284c7;
          font-weight: 500;
        }

        .ski-marker-pin {
          font-size: 26px;
          line-height: 1;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          padding: 0;
          background: rgba(255, 255, 255, 0.95);
          border: 2px solid rgba(255, 255, 255, 1);
          border-radius: 50%;
          box-shadow:
            0 0 0 1px rgba(255, 255, 255, 0.9),
            0 0 0 2px rgba(14, 165, 233, 0.25),
            0 0 14px rgba(255, 255, 255, 0.6),
            0 2px 8px rgba(0, 0, 0, 0.35);
          user-select: none;
        }
        .ski-marker-pin-hover {
          box-shadow:
            0 0 0 2px rgba(255, 255, 255, 1),
            0 0 0 3px rgba(14, 165, 233, 0.4),
            0 0 20px rgba(255, 255, 255, 0.8),
            0 4px 12px rgba(0, 0, 0, 0.4);
        }

        .mapboxgl-ctrl-group {
          border-radius: 10px !important;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1) !important;
          overflow: hidden;
        }
        .mapboxgl-ctrl-group button {
          width: 36px !important;
          height: 36px !important;
          background: #fff !important;
          border: none !important;
        }
        .mapboxgl-ctrl-group button:hover {
          background: #f0f9ff !important;
        }
        .mapboxgl-ctrl-group button + button {
          border-top: 1px solid #e2e8f0 !important;
        }
        .mapboxgl-ctrl-icon {
          opacity: 0.85;
        }
      `}</style>
    </div>
  );
};

export default SkiingPage;
