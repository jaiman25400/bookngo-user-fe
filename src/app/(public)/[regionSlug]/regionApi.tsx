const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export interface Resort {
  id: number;
  customer_display_name: string;
  customer_slug: string;
  customer_city: string;
  home_image_url: string | null;
}

export interface RegionResortsResponse {
  region: string;
  count: number;
  results: Resort[];
}

export async function fetchRegionResorts(region: string): Promise<ApiResponse<RegionResortsResponse>> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    const response = await fetch(
      `${API_BASE_URL}/user/ski-slopes?region=${encodeURIComponent(region)}`,
      {
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
        },
        next: { revalidate: 60 }, // Cache for 60 seconds
      }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorMessage = response.status === 404
        ? `Region "${region}" not found`
        : response.status >= 500
        ? 'Server error. Please try again later.'
        : `Request failed with status ${response.status}`;
      return { error: errorMessage };
    }

    const data = await response.json();
    
    // Validate response structure
    if (!data || typeof data !== 'object') {
      return { error: 'Invalid response format from server' };
    }

    return { data };
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        return { error: 'Request timeout. Please try again.' };
      }
      return { error: error.message || 'Failed to fetch region data' };
    }
    return { error: 'An unexpected error occurred. Please try again.' };
  }
}
