const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

interface ApiResponse<T> {
  data?: T;
  error?: string;
}
// vendorActivityApi.ts
export async function fetchVendorActivityByID(
  activityId: string
): Promise<ApiResponse<any>> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/user/vendors/activity/${activityId}`
    );

    if (!response.ok) {
      return { error: `API request failed with status ${response.status}` };
    }

    const data = await response.json();
    return { data };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}