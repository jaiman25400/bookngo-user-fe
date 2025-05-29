const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export async function fetchVendorDetailByName(vendorName: string): Promise<
  ApiResponse<{
    customerData: any;
    activity: any;
  }>
> {
  try {
    console.log("vend name :", vendorName);
    const response = await fetch(
      `${API_BASE_URL}/user/vendors/customerSlug/?slug=${vendorName}`
    );

    if (!response.ok) {
      return { error: `API request failed with status ${response.status}` };
    }

    const data = await response.json();
    console.log("Vendor Fetch :", data);
    return { data };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}
