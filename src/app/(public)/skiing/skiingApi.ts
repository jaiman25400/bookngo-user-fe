const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export interface SkiArea {
  name: string;
  latitude: number;
  longitude: number;
  city: string;
  customer_image: string;
  slug: string;
}

export async function fetchSkiingData(): Promise<ApiResponse<SkiArea[]>> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    const response = await fetch(
      `${API_BASE_URL}/user/ski-slopes/skiing-customers`,
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
      return { error: `API request failed with status ${response.status}` };
    }

    const data = await response.json();
    
    // Validate response structure
    if (!Array.isArray(data)) {
      return { error: 'Invalid response format from server' };
    }

    return { data };
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        return { error: 'Request timeout. Please try again.' };
      }
      return { error: error.message || 'Failed to fetch skiing data' };
    }
    return { error: 'An unexpected error occurred. Please try again.' };
  }
}
