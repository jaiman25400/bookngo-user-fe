"use client";

import { useEffect, useMemo, useState } from "react";
import { apiImageUrl } from "../lib/apiImageUrl";
import {
  fetchActivityDetailsUsingNonOfTickets,
  fetchSlotAvailableUsingDate,
  submitUserCheckOutData,
} from "../lib/bookingApi";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { parseISO, isSameDay } from "date-fns";
import RentalModal from "./RentalModal";
import Image from "next/image";
import {
  FiActivity,
  FiArrowRight,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiEdit,
  FiInfo,
  FiMail,
  FiMapPin,
  FiPhone,
  FiRefreshCw,
  FiShoppingBag,
  FiShoppingCart,
  FiUser,
  FiBook,
  FiAlertCircle,
  FiLoader,
  FiHome,
} from "react-icons/fi";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { isFreeAdmissionActivity } from "../lib/activityPricing";

type Booking = {
  name: string;
  email: string;
  phone: string;
  tickets: number;
  activityId: string;
  vendorSlug: string;
  /** From booking form when activity admission is free */
  freeAdmission?: boolean;
};

type ActivitySchedule = {
  id: number;
  day: string;
  start_time: string | null;
  end_time: string | null;
  duration: string;
  is_24hours: boolean;
  is_holiday: boolean;
  price: string;
};

type ActivityZone = {
  id: number;
  name: string;
  description: string;
  age_group: string;
  capacity: number;
  price: string;
  status: string;
  zone_thumbnail_image: string | null;
};

type ActivityData = {
  slot_interval_minutes: number;
  activity_name: string;
  /** Admission price; "0" or 0 means free public activity (rentals sold separately). */
  base_price?: string | number;
  holidays: { date: string }[];
  schedules: ActivitySchedule[];
  start_date: string;
  end_date: string;
  provides_rentals: boolean;
  zones: ActivityZone[];
  max_per_slot: number;
};

type SlotAvailabilityApi = {
  success: boolean;
  data?: {
    slots?: SlotInfo[];
  };
};

type ProceedToCheckoutApi = {
  BookingID?: string;
};

interface SlotInfo {
  slotTime: string;
  availableTickets: number;
  /** When API sends rental capacity per slot (preferred for free-admission activities). */
  availableRentals?: number;
}

function slotCapacity(slot: SlotInfo): number {
  if (
    typeof slot.availableRentals === "number" &&
    Number.isFinite(slot.availableRentals)
  ) {
    return Math.max(0, slot.availableRentals);
  }
  if (
    typeof slot.availableTickets === "number" &&
    Number.isFinite(slot.availableTickets)
  ) {
    return Math.max(0, slot.availableTickets);
  }
  return 0;
}

function formatZonePriceLabel(price: string): string {
  const n = Number.parseFloat(String(price).replace(/[^0-9.-]/g, ""));
  if (!Number.isFinite(n) || n <= 0) return "Free";
  return `$${n.toFixed(2)}`;
}

type RentalSelection = {
  inventoryId: number;
  sizeId: number;
  quantity: number;
  equipmentName: string;
  size: string;
  price: string;
};

export default function BookingConfirmationPage() {
  const [booking, setBooking] = useState<Booking | null>(null);
  const [activity, setActivity] = useState<ActivityData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [excludedDates, setExcludedDates] = useState<Date[]>([]);
  const [holidayDays, setHolidayDays] = useState<string[]>([]);
  const today = new Date();
  const activityStartDate = activity ? parseISO(activity.start_date) : today;
  const activityEndDate = activity ? parseISO(activity.end_date) : undefined;
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [providesRentals, setProvidesRentals] = useState<boolean | null>(null);
  const [showRentalModal, setShowRentalModal] = useState(false);
  const [selectedZone, setSelectedZone] = useState<ActivityZone | null>(null);
  const [activeZones, setActiveZones] = useState<ActivityZone[]>([]);
  const [selectedRentals, setSelectedRentals] = useState<RentalSelection[]>([]);
  const [rentalSelectionComplete, setRentalSelectionComplete] = useState(false);
  const [showRentalSummary, setShowRentalSummary] = useState(false);
  const [availableSlots, setAvailableSlots] = useState<SlotInfo[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [slotError, setSlotError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [bookingResolved, setBookingResolved] = useState(false);

  const router = useRouter();

  const isFreeActivity = useMemo(() => {
    if (activity != null) {
      return isFreeAdmissionActivity(activity.base_price);
    }
    return Boolean(booking?.freeAdmission);
  }, [activity, booking?.freeAdmission]);

  const ticketCountForSlots = useMemo(() => {
    if (isFreeActivity) return 0;
    const t = booking?.tickets;
    if (typeof t === "number" && t >= 1) return t;
    return 1;
  }, [isFreeActivity, booking?.tickets]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      // 1. Check sessionStorage first (immediate availability)
      const sessionData = sessionStorage.getItem("booking-data");

      if (sessionData) {
        try {
          const parsed = JSON.parse(sessionData) as Record<string, unknown>;
          if (!parsed || typeof parsed !== "object") {
            throw new Error("Invalid shape");
          }
          const ticketsRaw = parsed.tickets;
          let tickets =
            typeof ticketsRaw === "number" && Number.isFinite(ticketsRaw)
              ? ticketsRaw
              : Number.parseInt(String(ticketsRaw ?? ""), 10);
          if (!Number.isFinite(tickets)) {
            tickets = parsed.freeAdmission ? 0 : 1;
          }
          if (!parsed.freeAdmission && tickets < 1) {
            tickets = 1;
          }
          setBooking({
            name: String(parsed.name ?? ""),
            email: String(parsed.email ?? ""),
            phone: String(parsed.phone ?? ""),
            tickets,
            activityId: String(parsed.activityId ?? ""),
            vendorSlug: String(parsed.vendorSlug ?? ""),
            freeAdmission: Boolean(parsed.freeAdmission),
          });
          sessionStorage.removeItem("booking-data");
          setBookingResolved(true);
          return;
        } catch {
          setError("Invalid booking data. Please start over.");
          setLoading(false);
          setBookingResolved(true);
          return;
        }
      }

      // 2. Fallback to cookies (for page refreshes)
      const cookieValue = document.cookie
        .split("; ")
        .find((row) => row.startsWith("booking-data="))
        ?.split("=")[1];

      if (cookieValue) {
        try {
          const parsed = JSON.parse(decodeURIComponent(cookieValue)) as Record<
            string,
            unknown
          >;
          const ticketsRaw = parsed.tickets;
          let tickets =
            typeof ticketsRaw === "number" && Number.isFinite(ticketsRaw)
              ? ticketsRaw
              : Number.parseInt(String(ticketsRaw ?? ""), 10);
          if (!Number.isFinite(tickets)) {
            tickets = parsed.freeAdmission ? 0 : 1;
          }
          if (!parsed.freeAdmission && tickets < 1) {
            tickets = 1;
          }
          setBooking({
            name: String(parsed.name ?? ""),
            email: String(parsed.email ?? ""),
            phone: String(parsed.phone ?? ""),
            tickets,
            activityId: String(parsed.activityId ?? ""),
            vendorSlug: String(parsed.vendorSlug ?? ""),
            freeAdmission: Boolean(parsed.freeAdmission),
          });
        } catch {
          setError("Invalid booking data. Please start over.");
          setLoading(false);
        }
      } else {
        setError("No booking data found. Please complete your booking first.");
        setLoading(false);
      }
      setBookingResolved(true);
    } catch {
      setError("An error occurred while loading booking data.");
      setLoading(false);
      setBookingResolved(true);
    }
  }, []);

  useEffect(() => {
    const fetchActivityDetails = async () => {
      if (!bookingResolved) return;

      if (!booking?.activityId) {
        setError((prev) => prev || "No booking data found. Please start over.");
        setLoading(false);
        return;
      }

      setError(null);
      try {
        const response = await fetchActivityDetailsUsingNonOfTickets<ActivityData>(
          booking.activityId
        );

        if (response.error) {
          setError(response.error || "Failed to load activity details.");
          setLoading(false);
          return;
        }

        if (response.data) {
          setActivity(response.data);
          setProvidesRentals(Boolean(response.data.provides_rentals));

          const zones = Array.isArray(response.data.zones)
            ? response.data.zones
            : [];
          const filteredZones = zones.filter(
            (zone: ActivityZone) => zone?.status === "active"
          );
          setActiveZones(filteredZones);

          const holidays = Array.isArray(response.data.holidays)
            ? response.data.holidays
            : [];
          const holidayDates = holidays
            .filter((h: { date?: string }) => h?.date)
            .map((h: { date: string }) => parseISO(h.date));
          setExcludedDates(holidayDates);

          const schedules = Array.isArray(response.data.schedules)
            ? response.data.schedules
            : [];
          const weeklyHolidays = schedules
            .filter((schedule: ActivitySchedule) => schedule.is_holiday)
            .map((schedule: ActivitySchedule) => schedule.day);
          setHolidayDays(weeklyHolidays);
        } else {
          setError("Activity details not found.");
        }
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Failed to fetch activity details. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchActivityDetails();
  }, [booking, bookingResolved]);

  useEffect(() => {
    const fetchSlotAvailability = async () => {
      if (!selectedDate || !booking?.activityId) {
        setAvailableSlots([]);
        return;
      }

      setLoadingSlots(true);
      setSlotError(null);

      try {
        const formattedDate = selectedDate.toISOString().split("T")[0];
        const response = await fetchSlotAvailableUsingDate<SlotAvailabilityApi>(
          booking.activityId,
          formattedDate
        );

        if (response.error) {
          setSlotError(
            response.error || "Failed to load available time slots."
          );
          setAvailableSlots([]);
          return;
        }

        if (response.data?.success) {
          const raw = response.data.data?.slots;
          setAvailableSlots(Array.isArray(raw) ? raw : []);
        } else {
          setAvailableSlots([]);
        }
      } catch {
          setSlotError(
            "Failed to fetch available slots. Please try selecting another date."
          );
          setAvailableSlots([]);
        } finally {
        setLoadingSlots(false);
      }
    };

    fetchSlotAvailability();
  }, [selectedDate, booking?.activityId]);

  useEffect(() => {
    setSelectedRentals([]);
    setRentalSelectionComplete(false);
    setShowRentalSummary(false);
  }, [selectedDate, selectedTime, selectedZone]);

  useEffect(() => {
    if (activeZones.length === 1) {
      const onlyZone = activeZones[0];
      setSelectedZone((prev) => (prev?.id === onlyZone.id ? prev : onlyZone));
      return;
    }

    setSelectedZone((prev) => {
      if (!prev) return prev;
      const exists = activeZones.some((zone) => zone.id === prev.id);
      return exists ? prev : null;
    });
  }, [activeZones]);

  const handleContinueWithoutRentals = () => {
    setRentalSelectionComplete(true);
    setShowRentalSummary(true);
  };

  const handleRentalConfirm = (selections: RentalSelection[]) => {
    setShowRentalModal(false);
    setSelectedRentals(selections);

    if (selections.length > 0) {
      setRentalSelectionComplete(true);
      setShowRentalSummary(true);
    } else {
      setRentalSelectionComplete(false);
    }
  };

  const isDateExcluded = (date: Date) => {
    if (!activity) return false;

    const isSpecificHoliday = excludedDates.some((d) => isSameDay(d, date));
    const dayName = date.toLocaleDateString("en-US", { weekday: "long" });
    const isWeeklyHoliday = holidayDays.includes(dayName);
    const isBeforeStart = activityStartDate && date < activityStartDate;
    const isAfterEnd = activityEndDate && date > activityEndDate;

    return isSpecificHoliday || isWeeklyHoliday || isBeforeStart || isAfterEnd;
  };

  const handleRentalYes = () => {
    setShowRentalModal(true);
  };

  const handleNext = async () => {
    if (!booking || !selectedDate || !selectedTime || !selectedZone) {
      setSubmitError("Please complete all required fields.");
      return;
    }

    if (!isFreeActivity && ticketCountForSlots < 1) {
      setSubmitError("Invalid ticket count. Please go back and choose at least one ticket.");
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      const payload = {
        userDetails: {
          name: booking.name,
          email: booking.email,
          phone: booking.phone,
        },
        activityId: booking.activityId,
        vendorSlug: booking.vendorSlug,
        tickets: isFreeActivity ? 0 : ticketCountForSlots,
        date: selectedDate.toISOString().split("T")[0],
        time: selectedTime,
        zoneId: selectedZone.id,
        zoneName: selectedZone.name,
        rentals: selectedRentals.map((rental) => ({
          equipmentId: rental.inventoryId,
          equipmentName: rental.equipmentName,
          sizeValue: rental.size,
          sizeId: rental.sizeId,
          quantity: rental.quantity,
          price: rental.price,
        })),
      };

      const result = await submitUserCheckOutData<ProceedToCheckoutApi>(payload);

      if (result.error) {
        throw new Error(result.error);
      }

      const bookingId = result.data?.BookingID;

      if (!bookingId) {
        throw new Error("Booking ID not returned from server.");
      }

      if (typeof window !== "undefined") {
        sessionStorage.setItem("bookingId", bookingId);
      }

      router.push(`/checkout?bookingId=${bookingId}`);
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Failed to create booking. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-sky-100 mb-4">
            <FiLoader className="w-8 h-8 text-sky-600 animate-spin" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Loading Booking Details
          </h2>
          <p className="text-gray-600">Please wait while we load your booking information...</p>
        </div>
      </div>
    );
  }

  // Error state - no booking data
  if (!booking || error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
            <FiAlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {error ? "Error Loading Booking" : "No Booking Data Found"}
          </h2>
          <p className="text-gray-600 mb-6">
            {error ||
              "No booking data found. Please complete your booking first."}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/skiing"
              className="inline-flex items-center justify-center px-6 py-3 bg-sky-600 text-white font-medium rounded-lg hover:bg-sky-700 transition-colors shadow-md hover:shadow-lg"
            >
              <FiHome className="w-5 h-5 mr-2" />
              Browse Activities
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Error state - activity not found
  if (!activity && !loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
            <FiAlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Activity Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            We couldn&apos;t find the activity you&apos;re trying to book. It may have been removed or is no longer available.
          </p>
          <Link
            href="/skiing"
            className="inline-flex items-center justify-center px-6 py-3 bg-sky-600 text-white font-medium rounded-lg hover:bg-sky-700 transition-colors shadow-md hover:shadow-lg"
          >
            <FiHome className="w-5 h-5 mr-2" />
            Browse Activities
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <header className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
            Complete Your Booking
          </h1>
          <div className="mt-3 max-w-md mx-auto">
            <p className="text-gray-600 text-lg">
              {isFreeActivity
                ? "Pick a date and time for your rental. Skating is free; you only pay for equipment you add."
                : "Finalize your activity details and select preferred options"}
            </p>
            <div className="mt-4 h-1 w-20 bg-sky-600 rounded-full mx-auto"></div>
          </div>
        </header>

        {/* Submit Error Banner */}
        {submitError && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
            <div className="flex items-start">
              <FiAlertCircle className="w-5 h-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-red-800 font-medium">Booking Error</p>
                <p className="text-red-700 text-sm mt-1">{submitError}</p>
              </div>
              <button
                onClick={() => setSubmitError(null)}
                className="text-red-600 hover:text-red-800 ml-4"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Booking Summary Card */}
        <section className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6 md:p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900 flex items-center">
              <FiInfo className="mr-2 text-sky-600" />
              Booking Summary
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-gray-100 rounded-lg p-5 bg-gray-50">
              <h3 className="font-medium text-gray-700 mb-3 flex items-center text-sm uppercase tracking-wider">
                <FiUser className="mr-2 text-sky-500" />
                Customer Details
              </h3>
              <ul className="space-y-3">
                {[
                  { label: "Name", value: booking.name, icon: FiUser },
                  { label: "Email", value: booking.email, icon: FiMail },
                  { label: "Phone", value: booking.phone, icon: FiPhone },
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start">
                    <item.icon className="mt-0.5 mr-2 text-gray-400 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <span className="text-gray-500 text-sm block">{item.label}</span>
                      <p className="font-medium text-gray-800 truncate">{item.value}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border border-gray-100 rounded-lg p-5 bg-gray-50">
              <h3 className="font-medium text-gray-700 mb-3 flex items-center text-sm uppercase tracking-wider">
                <FiCalendar className="mr-2 text-sky-500" />
                Activity Details
              </h3>
              <ul className="space-y-3">
                {[
                  ...(isFreeActivity
                    ? [
                        {
                          label: "Booking",
                          value: "Free activity — rental equipment",
                          icon: FiShoppingBag,
                        },
                      ]
                    : [
                        {
                          label: "Tickets",
                          value: String(booking.tickets),
                          icon: FiBook,
                        },
                      ]),
                  {
                    label: "Activity",
                    value: activity?.activity_name || booking.activityId,
                    icon: FiActivity,
                  },
                  {
                    label: "Vendor",
                    value: booking.vendorSlug.replace(/-/g, " "),
                    icon: FiShoppingBag,
                  },
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start">
                    <item.icon className="mt-0.5 mr-2 text-gray-400 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <span className="text-gray-500 text-sm block">{item.label}</span>
                      <p className="font-medium text-gray-800 truncate">{item.value}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Date & Time Selection */}
        <section className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6 md:p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900 flex items-center">
              <FiCalendar className="mr-2 text-sky-600" />
              {isFreeActivity
                ? "Select date & time for rentals"
                : "Select Date & Time"}
            </h2>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Choose a date
            </label>
            <div className="relative">
              <DatePicker
                selected={selectedDate}
                onChange={(date) => {
                  setSelectedDate(date);
                  setSelectedTime(null);
                  setSlotError(null);
                }}
                minDate={activityStartDate > today ? activityStartDate : today}
                maxDate={activityEndDate}
                excludeDates={excludedDates}
                filterDate={(date) => !isDateExcluded(date)}
                placeholderText="Select a date"
                dateFormat="MMMM d, yyyy"
                className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 hover:border-gray-400 transition-colors"
                dayClassName={(date) => {
                  const baseClass = "hover:bg-gray-100 transition-colors";
                  return isDateExcluded(date)
                    ? `${baseClass} bg-gray-50 text-gray-400 cursor-not-allowed`
                    : baseClass;
                }}
              />
              <FiCalendar className="absolute left-3 top-3.5 text-gray-400" />
            </div>
          </div>

          {selectedDate && (
            <div className="flex items-center text-gray-700 mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
              <FiCheckCircle className="text-green-600 mr-2 flex-shrink-0" />
              <span>
                <span className="font-medium">Selected Date:</span>{" "}
                {selectedDate.toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          )}

          {selectedDate && (
            <>
              {loadingSlots ? (
                <div className="mt-5 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-center">
                    <FiLoader className="w-5 h-5 text-gray-400 animate-spin mr-2" />
                    <span className="text-gray-600">Loading available time slots...</span>
                  </div>
                </div>
              ) : slotError ? (
                <div className="mt-5 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-start">
                    <FiAlertCircle className="w-5 h-5 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-red-800 font-medium text-sm">Error Loading Slots</p>
                      <p className="text-red-700 text-sm mt-1">{slotError}</p>
                    </div>
                  </div>
                </div>
              ) : availableSlots.length > 0 ? (
                <div className="mt-5">
                  {isFreeActivity && (
                    <p className="text-sm text-gray-600 mb-3 rounded-lg bg-sky-50 border border-sky-100 px-3 py-2">
                      Each time shows how many{" "}
                      <span className="font-semibold text-gray-800">
                        rental spots
                      </span>{" "}
                      are open for that window. Admission to the rink is free;
                      you&apos;ll add skates or gear in the next step.
                    </p>
                  )}
                  <label
                    htmlFor="time"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    {isFreeActivity
                      ? "Select time (rental availability)"
                      : "Select time slot"}
                  </label>
                  <div className="relative">
                    <select
                      id="time"
                      value={selectedTime ?? ""}
                      onChange={(e) => setSelectedTime(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 appearance-none hover:border-gray-400 transition-colors bg-white"
                    >
                      <option value="" disabled>
                        {isFreeActivity
                          ? "Choose a time for your rental"
                          : "Choose a time slot"}
                      </option>
                      {availableSlots.map((slot) => {
                        const cap = slotCapacity(slot);
                        const isDisabled = isFreeActivity
                          ? cap < 1
                          : cap < ticketCountForSlots;
                        return (
                          <option
                            key={slot.slotTime}
                            value={slot.slotTime}
                            disabled={isDisabled}
                          >
                            {slot.slotTime.substring(0, 5)}
                            {isFreeActivity
                              ? isDisabled
                                ? " — No rentals available"
                                : ` — ${cap} rental${cap !== 1 ? "s" : ""} available`
                              : isDisabled
                                ? ` - Only ${cap} ticket${cap !== 1 ? "s" : ""} available`
                                : ` - ${cap} ticket${cap !== 1 ? "s" : ""} available`}
                          </option>
                        );
                      })}
                    </select>
                    <FiClock className="absolute right-3 top-3.5 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              ) : (
                <div className="mt-5 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start">
                    <FiAlertCircle className="w-5 h-5 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-yellow-800 font-medium text-sm">No Time Slots Available</p>
                      <p className="text-yellow-700 text-sm mt-1">
                        There are no available time slots for the selected date. Please try another date.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {selectedTime && (
            <div className="flex items-center text-gray-700 mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
              <FiCheckCircle className="text-green-600 mr-2 flex-shrink-0" />
              <span>
                <span className="font-medium">Selected Time:</span> {selectedTime.substring(0, 5)}
              </span>
            </div>
          )}

          {/* Zone Selection */}
          {selectedTime && activeZones.length > 0 && !selectedZone && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FiMapPin className="mr-2 text-sky-500" />
                Select Activity Zone
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {activeZones.map((zone) => {
                  const zoneThumbUrl = apiImageUrl(zone.zone_thumbnail_image);
                  return (
                  <div
                    key={zone.id}
                    className="border rounded-xl p-4 cursor-pointer transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg border-gray-200 bg-white"
                    onClick={() => setSelectedZone(zone)}
                  >
                    <div className="flex flex-col h-full">
                      {zoneThumbUrl && (
                        <div className="relative w-full h-52 mb-3 overflow-hidden rounded-lg">
                          <Image
                            src={zoneThumbUrl}
                            alt={zone.name}
                            fill
                            className="object-cover transition-transform duration-500 hover:scale-105"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            loading="lazy"
                            quality={80}
                          />
                        </div>
                      )}
                      <div className="flex-grow">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-gray-900">{zone.name}</h4>
                          <span className="font-bold text-gray-900">
                            {formatZonePriceLabel(zone.price)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {zone.description}
                        </p>
                        <div>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-sky-100 text-sky-800">
                            {zone.age_group}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
                })}
              </div>
            </div>
          )}

          {selectedZone && (
            <div className="mt-6 p-5 bg-sky-50 rounded-xl border border-sky-200">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center">
                  <FiMapPin className="text-sky-600 mr-2" />
                  <h4 className="font-semibold text-gray-800">Selected Zone</h4>
                </div>
                {activeZones.length > 1 && (
                  <button
                    onClick={() => setSelectedZone(null)}
                    className="text-sky-600 hover:text-sky-800 text-sm font-medium flex items-center transition-colors"
                  >
                    <FiRefreshCw className="mr-1" />
                    Change
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-[220px,1fr] gap-4 items-start">
                {apiImageUrl(selectedZone.zone_thumbnail_image) ? (
                  <div className="relative w-full h-40 md:h-36 rounded-lg overflow-hidden border border-gray-200">
                    <Image
                      src={apiImageUrl(selectedZone.zone_thumbnail_image)!}
                      alt={selectedZone.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 220px"
                      loading="lazy"
                      quality={85}
                    />
                  </div>
                ) : (
                  <div className="w-full h-40 md:h-36 rounded-lg border border-dashed border-sky-300 bg-sky-100/60 flex items-center justify-center text-sky-700 text-sm font-medium">
                    No image available
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-lg font-semibold text-gray-900">
                    {selectedZone.name}
                  </p>
                  <p className="text-sm text-gray-600 mt-1 whitespace-pre-line">
                    {selectedZone.description || "No description available for this zone."}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 mt-3">
                    <span className="bg-sky-100 text-sky-800 text-xs px-2.5 py-1 rounded">
                      {selectedZone.age_group}
                    </span>
                    <span className="bg-white text-gray-800 text-sm px-2.5 py-1 rounded border border-sky-200">
                      Capacity: {selectedZone.capacity}
                    </span>
                    <span className="font-semibold text-gray-900">
                      {formatZonePriceLabel(selectedZone.price)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Rental Selection */}
          {selectedTime &&
            selectedZone &&
            providesRentals !== null &&
            !rentalSelectionComplete && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <FiShoppingBag className="mr-2 text-sky-500" />
                  Rental Equipment
                </h3>
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                  <p className="text-gray-700 mb-4 text-center">
                    {isFreeActivity
                      ? "Skating is free. Reserve rental skates or equipment for your visit, or continue if you already have your own."
                      : "Would you like to add rental equipment to your booking?"}
                  </p>
                  <div className="flex flex-col sm:flex-row justify-center gap-3">
                    <button
                      onClick={handleRentalYes}
                      className="flex-1 max-w-xs bg-sky-600 hover:bg-sky-700 text-white font-medium py-3 px-4 rounded-lg transition-all shadow hover:shadow-md transform hover:-translate-y-0.5 flex items-center justify-center"
                    >
                      <FiShoppingCart className="mr-2" />
                      Select Rentals
                    </button>
                    <button
                      onClick={handleContinueWithoutRentals}
                      className="flex-1 max-w-xs bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 font-medium py-3 px-4 rounded-lg transition-all hover:shadow-md flex items-center justify-center"
                    >
                      <FiArrowRight className="mr-2" />
                      {isFreeActivity
                        ? "I have my own equipment"
                        : "Continue Without Rentals"}
                    </button>
                  </div>
                </div>
              </div>
            )}

          {/* Rental Summary */}
          {showRentalSummary && selectedRentals.length > 0 && (
            <div className="mt-6 bg-gray-50 rounded-lg p-5 border border-gray-200">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-gray-800 flex items-center">
                  <FiShoppingBag className="mr-2 text-sky-600" />
                  Selected Rentals
                </h3>
                <button
                  onClick={() => setShowRentalModal(true)}
                  className="text-sky-600 hover:text-sky-800 text-sm font-medium flex items-center transition-colors"
                >
                  <FiEdit className="mr-1" /> Edit
                </button>
              </div>
              <div className="space-y-3">
                {selectedRentals.map((rental, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center bg-white p-3 rounded-lg border border-gray-200"
                  >
                    <div>
                      <p className="font-medium text-gray-800">
                        {rental.quantity} × {rental.equipmentName}
                      </p>
                      <p className="text-sm text-gray-500">Size: {rental.size}</p>
                    </div>
                    <span className="font-semibold text-gray-900">
                      ${(parseFloat(rental.price) * rental.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {showRentalModal && booking && (
            <RentalModal
              onClose={() => setShowRentalModal(false)}
              onConfirm={handleRentalConfirm}
              clientSlug={booking.vendorSlug}
              bookingDate={selectedDate}
              bookingTime={selectedTime}
              activityId={booking.activityId}
            />
          )}

          {/* Next Button */}
          {(rentalSelectionComplete || !providesRentals) &&
            selectedTime &&
            selectedZone && (
              <div className="mt-8 flex justify-end">
                <button
                  onClick={handleNext}
                  disabled={submitting}
                  className="bg-sky-600 hover:bg-sky-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-8 rounded-lg shadow-md transition-all transform hover:-translate-y-0.5 hover:shadow-lg disabled:transform-none flex items-center"
                >
                  {submitting ? (
                    <>
                      <FiLoader className="w-5 h-5 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Continue to Payment
                      <FiArrowRight className="ml-2" />
                    </>
                  )}
                </button>
              </div>
            )}
        </section>
      </div>
    </div>
  );
}
