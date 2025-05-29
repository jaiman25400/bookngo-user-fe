const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export async function fetchRegionResorts(region: string): Promise<ApiResponse<{
  region: string;
  count: number;
  results: any[];
}>> {
  try {
    const response = await fetch(`${API_BASE_URL}/user/ski-slopes?region=${encodeURIComponent(region)}`);
    
    if (!response.ok) {
      return { error: `API request failed with status ${response.status}` };
    }

    const data = await response.json();
    console.log('Region API  DATA ',data)
    return { data };
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Unknown error occurred' };
  }
}