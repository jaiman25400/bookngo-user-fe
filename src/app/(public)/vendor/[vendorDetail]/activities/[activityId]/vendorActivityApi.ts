const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export interface ActivityData {
  id: number;
  activity_name: string;
  base_price: string;
  duration_hours: string | number;
  activity_thumbnail_image: string | null;
  activity_image_gallery?: string[] | null;
  activity_description: string | null;
  age_group: string | null;
  requires_waiver?: boolean;
  safety_instructions?: string | null;
  max_per_slot?: number;
  slot_interval_minutes?: number;
  /** When true, booking is done on the company site; use external_booking_url */
  redirect_to_external_website?: boolean;
  /** URL to redirect users for booking (when redirect_to_external_website is true) */
  external_booking_url?: string | null;
}

export async function fetchVendorActivityByID(
  activityId: string
): Promise<ApiResponse<ActivityData>> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    const response = await fetch(
      `${API_BASE_URL}/user/vendors/activity/${encodeURIComponent(activityId)}`,
      {
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
        },
        next: { revalidate: 60 }, // Cache for 60 seconds
      }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorMessage =
        response.status === 404
          ? `Activity with ID "${activityId}" not found`
          : response.status >= 500
          ? "Server error. Please try again later."
          : `Request failed with status ${response.status}`;
      return { error: errorMessage };
    }

    const data = await response.json();

    // Validate response structure
    if (!data || typeof data !== "object") {
      return { error: "Invalid response format from server" };
    }

    return { data };
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === "AbortError") {
        return { error: "Request timeout. Please try again." };
      }
      return { error: error.message || "Failed to fetch activity data" };
    }
    return { error: "An unexpected error occurred. Please try again." };
  }
}
