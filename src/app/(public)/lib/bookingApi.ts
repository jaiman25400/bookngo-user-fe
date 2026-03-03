const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export async function getBookingDetailsByBookingID<T = unknown>(
  bookingId: string
): Promise<T> {
  const response = await fetch(
    `${API_BASE_URL}/user/bookings/bookingID?id=${bookingId}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch booking details");
  }
  return (await response.json()) as T;
}

// Confirm cash payment
export async function confirmCashPayment<T = unknown>(
  bookingId: string
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}/user/bookings/confirmBooking`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ bookingId: bookingId }),
  });

  if (!response.ok) {
    throw new Error("Payment confirmation failed");
  }
  return (await response.json()) as T;
}

export async function fetchActivityDetailsUsingNonOfTickets<T = unknown>(
  activityId: string
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/user/vendors/activity/${activityId}`
    );
    if (!response.ok) {
      return { error: `API request failed with status ${response.status}` };
    }

    const data = (await response.json()) as T;
    console.log("Data Booking Confirmation :", data);
    return { data };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

export async function fetchInventoryUsingCustomerSlug(
  customerSlug: string,
  bookingDate: Date | null,
  bookingTime: string | null,
  activityId: string | null
): Promise<ApiResponse<unknown>> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/user/bookings/rentals/customerSlug?slug=${customerSlug}&bookingDate=${bookingDate?.toISOString()}&bookingTime=${bookingTime}&activityId=${activityId}`
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

export async function fetchSlotAvailableUsingDate<T = unknown>(
  activityId: string,
  date: string
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/user/bookings/check-availability?date=${date}&activityId=${activityId}`
    );
    if (!response.ok) {
      return { error: `API request failed with status ${response.status}` };
    }
    const data = (await response.json()) as T;
    console.log("Slot Availability Data: API", data);
    return { data };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

// Updated submitUser Data function
export async function submitUserCheckOutData<T = unknown>(
  payload: unknown
): Promise<ApiResponse<T>> {
  try {
    console.log("API PAYLOAD :", payload);
    const response = await fetch(
      `${API_BASE_URL}/user/bookings/proceedToCheckout`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      return { error: `API request failed with status ${response.status}` };
    }

    const data = (await response.json()) as T;
    console.log("Booking Confirmation Response:", data);
    return { data };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}
