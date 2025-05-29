const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export async function fetchSkiingData(): Promise<ApiResponse<{}>> {
  try {
    const response = await fetch(`${API_BASE_URL}/user/ski-slopes/skiing-customers`);
    
    if (!response.ok) {
      return { error: `API request failed with status ${response.status}` };
    }

    const data = await response.json();
    console.log('Ski Customer  DATA ',data)
    return { data };
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Unknown error occurred' };
  }
}