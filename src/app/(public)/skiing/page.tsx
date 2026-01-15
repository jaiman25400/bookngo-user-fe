"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { fetchSkiingData, type SkiArea } from "./skiingApi";
import {
  FiMapPin,
  FiSearch,
  FiX,
  FiAlertCircle,
  FiFilter,
} from "react-icons/fi";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

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

  // Load data
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

  // Filter areas based on search
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

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || !skiAreas.length || map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/outdoors-v12",
      center: [-79.416, 43.7], // Ontario, Canada center
      zoom: 6,
      attributionControl: false,
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    // Add custom markers
    skiAreas.forEach((area) => {
      const el = document.createElement("div");
      el.className = "custom-marker";
      el.innerHTML = `
        <div class="marker-pin">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#0284c7"/>
          </svg>
        </div>
      `;

      const marker = new mapboxgl.Marker(el)
        .setLngLat([area.longitude, area.latitude])
        .setPopup(
          new mapboxgl.Popup({ offset: 25, className: "custom-popup" }).setHTML(
            `
            <div class="popup-content">
              <h3 class="popup-title">${area.name}</h3>
              <p class="popup-city">${area.city}</p>
              <button class="popup-button" data-slug="${area.slug}">View Details</button>
            </div>
          `
          )
        )
        .addTo(map.current);

      marker.getElement().addEventListener("click", () => {
        router.push(`/vendor/${area.slug}`);
      });

      markersRef.current.push(marker);
    });

    // Handle popup button clicks
    map.current.on("popupopen", (e) => {
      const button = e.popup
        .getElement()
        ?.querySelector(".popup-button") as HTMLButtonElement;
      if (button) {
        button.addEventListener("click", () => {
          const slug = button.getAttribute("data-slug");
          if (slug) router.push(`/vendor/${slug}`);
        });
      }
    });

    return () => {
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
      map.current?.remove();
      map.current = null;
    };
  }, [skiAreas, router]);

  // Fly to area on list item click
  const handleAreaClick = useCallback(
    (area: SkiArea) => {
      setSelectedArea(area);
      if (map.current) {
        map.current.flyTo({
          center: [area.longitude, area.latitude],
          zoom: 10,
          duration: 1500,
        });

        // Open popup for the selected area
        const marker = markersRef.current.find((m) => {
          const lngLat = m.getLngLat();
          return (
            Math.abs(lngLat.lng - area.longitude) < 0.001 &&
            Math.abs(lngLat.lat - area.latitude) < 0.001
          );
        });

        if (marker) {
          marker.togglePopup();
        }
      }
      router.push(`/vendor/${area.slug}`);
    },
    [router]
  );

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-sky-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading ski resorts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
            <FiAlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Resorts</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 flex-col lg:flex-row">
      {/* Left Panel - Ski Areas List */}
      <div className="w-full lg:w-2/5 xl:w-1/3 h-full flex flex-col bg-white border-r border-gray-200 shadow-lg">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-sky-600 to-blue-600">
          <h1 className="text-3xl font-bold text-white mb-2">Find Your Slopes</h1>
          <p className="text-white/90 text-sm">
            Discover {skiAreas.length} ski resort{skiAreas.length !== 1 ? "s" : ""} across Canada
          </p>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search resorts by name or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <FiX className="w-5 h-5" />
              </button>
            )}
          </div>
          {searchQuery && (
            <p className="mt-2 text-sm text-gray-600">
              {filteredAreas.length} result{filteredAreas.length !== 1 ? "s" : ""} found
            </p>
          )}
        </div>

        {/* Resorts List */}
        <div className="flex-1 overflow-y-auto">
          {filteredAreas.length > 0 ? (
            <div className="p-4 space-y-4">
              {filteredAreas.map((area) => (
                <div
                  key={area.slug}
                  onClick={() => handleAreaClick(area)}
                  className={`group relative bg-white rounded-xl border-2 transition-all duration-200 cursor-pointer overflow-hidden hover:shadow-lg transform hover:-translate-y-1 ${
                    selectedArea?.slug === area.slug
                      ? "border-sky-500 shadow-md"
                      : "border-gray-200 hover:border-sky-300"
                  }`}
                >
                  {/* Image */}
                  <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${area.customer_image}`}
                      alt={area.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      sizes="(max-width: 1024px) 100vw, 33vw"
                      loading="lazy"
                      quality={85}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-sky-600 transition-colors line-clamp-1">
                        {area.name}
                      </h3>
                    </div>
                    <div className="flex items-center text-gray-600 text-sm">
                      <FiMapPin className="w-4 h-4 mr-1.5 flex-shrink-0 text-sky-600" />
                      <span className="line-clamp-1">{area.city}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <FiSearch className="w-16 h-16 text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No resorts found
              </h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search terms
              </p>
              <button
                onClick={() => setSearchQuery("")}
                className="px-4 py-2 text-sky-600 hover:text-sky-700 font-medium"
              >
                Clear search
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Right Panel - Map */}
      <div className="flex-1 relative h-full lg:h-auto">
        <div
          ref={mapContainer}
          className="w-full h-full"
          style={{ minHeight: "400px" }}
        />
        {!process.env.NEXT_PUBLIC_MAPBOX_TOKEN && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="text-center p-8">
              <FiMapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Mapbox token not configured</p>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        .custom-marker {
          cursor: pointer;
          transition: transform 0.2s;
        }
        .custom-marker:hover {
          transform: scale(1.2);
        }
        .marker-pin {
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
        }
        .mapboxgl-popup-content {
          padding: 0;
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
        }
        .custom-popup .popup-content {
          padding: 16px;
          min-width: 200px;
        }
        .popup-title {
          font-size: 18px;
          font-weight: bold;
          color: #111827;
          margin-bottom: 4px;
        }
        .popup-city {
          font-size: 14px;
          color: #6b7280;
          margin-bottom: 12px;
        }
        .popup-button {
          width: 100%;
          padding: 8px 16px;
          background-color: #0284c7;
          color: white;
          border: none;
          border-radius: 6px;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        .popup-button:hover {
          background-color: #0369a1;
        }
        .mapboxgl-ctrl-group {
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        }
      `}</style>
    </div>
  );
};

export default SkiingPage;
