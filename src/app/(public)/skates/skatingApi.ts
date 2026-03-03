const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export interface SkatingVenue {
  name: string;
  latitude: number;
  longitude: number;
  city: string;
  /** May be empty or null for new clients without an image yet */
  customer_image?: string | null;
  slug: string;
}

export async function fetchSkatingData(): Promise<ApiResponse<SkatingVenue[]>> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(
      `${API_BASE_URL}/user/ski-slopes/ice-skating-customers`,
      {
        signal: controller.signal,
        headers: { "Content-Type": "application/json" },
        next: { revalidate: 60 },
      }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      return { error: `API request failed with status ${response.status}` };
    }

    const data = await response.json();
    if (!Array.isArray(data)) {
      return { error: "Invalid response format from server" };
    }

    return { data };
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === "AbortError") {
        return { error: "Request timeout. Please try again." };
      }
      return { error: error.message || "Failed to fetch skating data" };
    }
    return { error: "An unexpected error occurred. Please try again." };
  }
}

export interface SkatingRegionVenue {
  id: number;
  customer_display_name: string;
  customer_slug: string;
  customer_city: string;
  home_image_url: string | null;
}

export interface SkatingRegionResponse {
  region: string;
  count: number;
  results: SkatingRegionVenue[];
}

export async function fetchSkatingByRegion(
  region: string
): Promise<ApiResponse<SkatingRegionResponse>> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const params = new URLSearchParams({
      region,
      activityType: "skating",
    });
    const response = await fetch(
      `${API_BASE_URL}/user/ski-slopes?${params.toString()}`,
      {
        signal: controller.signal,
        headers: { "Content-Type": "application/json" },
        next: { revalidate: 60 },
      }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errMsg =
        response.status === 404
          ? `Region "${region}" not found`
          : response.status >= 500
            ? "Server error. Please try again later."
            : `Request failed with status ${response.status}`;
      return { error: errMsg };
    }

    const data = await response.json();
    if (!data || typeof data !== "object") {
      return { error: "Invalid response format from server" };
    }

    return { data };
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === "AbortError") {
        return { error: "Request timeout. Please try again." };
      }
      return { error: error.message || "Failed to fetch skating data" };
    }
    return { error: "An unexpected error occurred. Please try again." };
  }
}
