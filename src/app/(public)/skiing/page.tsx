"use client";
import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { fetchSkiingData } from "./skiingApi";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

interface SkiArea {
  name: string;
  latitude: number;
  longitude: number;
  city: string;
  customer_image: string;
  slug: string; // Added slug to interface
}

const SkiingPage = () => {
  const router = useRouter();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [skiAreas, setSkiAreas] = useState<SkiArea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const { data, error } = await fetchSkiingData();
        if (error) throw new Error(error);
        if (data) setSkiAreas(data as SkiArea[]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    if (!mapContainer.current || !skiAreas.length) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/outdoors-v12",
      center: [-79.416, 43.7],
      zoom: 7,
    });

    skiAreas.forEach((area) => {
      const marker = new mapboxgl.Marker({
        color: "#3b82f6",
        scale: 0.8,
      })
        .setLngLat([area.longitude, area.latitude])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }).setHTML(`
            <div class="min-w-[200px]">
              <h3 class="font-bold text-lg">${area.name}</h3>
              <p class="text-gray-600">${area.city}</p>
            </div>
          `)
        )
        .addTo(map.current!);
    });

    return () => {
      map.current?.remove();
    };
  }, [skiAreas]);

  // Removed handleLocationClick function

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );

  if (error)
    return (
      <div className="flex h-screen items-center justify-center text-red-500">
        {error}
      </div>
    );

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Panel - Ski Areas List */}
      <div className="w-1/2 h-full overflow-y-auto p-6 border-r bg-white shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          Find your Slopes
        </h1>
        <div className="space-y-4 pr-4">
          {" "}
          {/* Added padding-right to prevent content under scrollbar */}
          {skiAreas.map((area) => (
            <div
              key={area.name}
              onClick={() => router.push(`/vendor/${area.slug}`)}
              className="p-4 rounded-lg transition-all duration-200 hover:bg-blue-50 cursor-pointer group border border-transparent hover:border-blue-200"
            >
              <div className="relative h-40 w-full rounded-md overflow-hidden mb-3">
                <Image
                  src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${area.customer_image}`}
                  alt={area.name}
                  fill
                  className="object-cover transform group-hover:scale-105 transition-transform duration-200"
                  sizes="(max-width: 768px) 100vw, 50vw" // Updated sizes for 50% width
                  loading="lazy"
                  quality={75}
                />
              </div>
              <h2 className="text-xl font-semibold text-gray-800 group-hover:text-blue-600">
                {area.name}
              </h2>
              <p className="text-gray-500 text-sm mt-1">{area.city}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel - Map */}
      <div ref={mapContainer} className="w-1/2 h-full relative">
        <div className="absolute top-4 left-4 bg-white p-3 rounded-lg shadow-md z-10">
          <h3 className="text-sm font-semibold text-gray-700">
            Click locations to explore
          </h3>
        </div>
      </div>
    </div>
  );
};

export default SkiingPage;
