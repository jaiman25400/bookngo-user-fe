"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  confirmCashPayment,
  getBookingDetailsByBookingID,
} from "../lib/bookingApi";
import {
  FiDollarSign,
  FiCheckCircle,
  FiCalendar,
  FiClock,
  FiMapPin,
  FiShoppingBag,
  FiUser,
  FiInfo,
  FiLoader,
  FiAlertCircle,
  FiHome,
  FiMail,
  FiPhone,
  FiArrowRight,
  FiShield,
  FiActivity,
} from "react-icons/fi";
import Link from "next/link";

interface BookingCosts {
  activityCost: number;
  rentalsTotal: number;
  rentalItems: RentalItem[];
  subtotal: number;
  tax: number;
  total: number;
}

interface RentalItem {
  quantity: number;
  equipmentName: string;
  sizeValue: string;
  itemTotal: number;
}

interface BookingData {
  user_name: string;
  user_email: string;
  user_phone: string;
  bookingDate: string;
  bookingTime: string;
  zoneName?: string;
  vendorSlug: string;
  numberOfTickets: number;
  activity_base_price: string;
  activityId: string;
  costBreakdown?: BookingCosts;
}

export default function PaymentPage() {
  const searchParams = useSearchParams();
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [booking, setBooking] = useState<BookingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const id =
      searchParams.get("bookingId") ||
      sessionStorage.getItem("bookingId") ||
      null;

    if (!id) {
      setError("No booking ID found. Please complete your booking first.");
      setLoading(false);
      return;
    }

    setBookingId(id);
  }, [searchParams]);

  useEffect(() => {
    if (!bookingId) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const bookingData = await getBookingDetailsByBookingID<BookingData>(
          bookingId
        );

        if (!bookingData) {
          setError("Booking details not found. The booking may have expired.");
          return;
        }

        setBooking(bookingData);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load booking details. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [bookingId]);

  const handleConfirmPayment = async () => {
    if (!bookingId) {
      setSubmitError("Booking ID is missing. Cannot confirm payment.");
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      await confirmCashPayment(bookingId);
      
      // Show confirmation screen instead of redirecting
      setIsConfirmed(true);
      
      // Clear booking ID from session storage after a delay
      if (typeof window !== "undefined") {
        setTimeout(() => {
          sessionStorage.removeItem("bookingId");
        }, 5000);
      }
    } catch (err) {
      setSubmitError(
        err instanceof Error
          ? err.message
          : "Payment confirmation failed. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const costs: BookingCosts = booking?.costBreakdown || {
    activityCost: 0,
    rentalsTotal: 0,
    rentalItems: [],
    subtotal: 0,
    tax: 0,
    total: 0,
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
          <p className="text-gray-600">
            Please wait while we fetch your booking information...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
            <FiAlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {error ? "Error Loading Booking" : "Booking Not Found"}
          </h2>
          <p className="text-gray-600 mb-6">
            {error ||
              "No booking data found. Please complete your booking first."}
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

  // Booking Confirmation Success Screen
  if (isConfirmed && booking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-sky-50 to-blue-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Success Animation & Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-100 mb-6 shadow-lg">
              <FiCheckCircle className="w-14 h-14 text-green-600" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Booking Confirmed!
            </h1>
            <p className="text-xl text-gray-600 mb-2">
              Your booking has been successfully confirmed
            </p>
            <div className="mt-4 h-1 w-24 bg-green-500 rounded-full mx-auto"></div>
          </div>

          {/* Booking Confirmation Card */}
          <div className="bg-white rounded-3xl border-2 border-green-200 shadow-2xl p-8 md:p-10 mb-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center px-6 py-3 bg-green-50 rounded-full mb-4">
                <FiCheckCircle className="w-6 h-6 text-green-600 mr-2" />
                <span className="font-semibold text-green-800">
                  Payment Confirmed
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                Thank you for your booking!
              </h2>
              <p className="text-gray-600">
                We look forward to seeing you at the venue
              </p>
            </div>

            {/* Booking Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Booking ID */}
              <div className="bg-gradient-to-br from-sky-50 to-blue-50 rounded-xl p-6 border border-sky-100">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 rounded-lg bg-sky-100 flex items-center justify-center mr-3">
                    <FiCheckCircle className="w-5 h-5 text-sky-600" />
                  </div>
                  <h3 className="font-semibold text-gray-700 text-sm uppercase tracking-wider">
                    Booking ID
                  </h3>
                </div>
                <p className="text-2xl font-bold text-sky-600 font-mono">
                  {bookingId?.slice(0, 8).toUpperCase()}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Keep this for your records
                </p>
              </div>

              {/* Total Amount */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center mr-3">
                    <FiDollarSign className="w-5 h-5 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-700 text-sm uppercase tracking-wider">
                    Total Amount
                  </h3>
                </div>
                <p className="text-3xl font-bold text-green-600">
                  ${costs.total?.toFixed(2) || "0.00"}
                </p>
                <p className="text-sm text-gray-500 mt-2">Pay at the venue</p>
              </div>
            </div>

            {/* Booking Summary */}
            <div className="border-t border-gray-200 pt-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <FiActivity className="mr-2 text-sky-600" />
                Booking Details
              </h3>
              <div className="space-y-4">
                <div className="flex items-start justify-between py-4 border-b border-gray-100">
                  <div className="flex items-start">
                    <FiUser className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">{booking.user_name}</p>
                      <p className="text-sm text-gray-600">{booking.user_email}</p>
                      <p className="text-sm text-gray-600">{booking.user_phone}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start justify-between py-4 border-b border-gray-100">
                  <div className="flex items-start">
                    <FiCalendar className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">{booking.bookingDate}</p>
                      <div className="flex items-center mt-1">
                        <FiClock className="w-4 h-4 text-gray-400 mr-2" />
                        <p className="text-sm text-gray-600">{booking.bookingTime}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-start justify-between py-4 border-b border-gray-100">
                  <div className="flex items-start">
                    <FiMapPin className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">
                        {booking.zoneName || "Not specified"}
                      </p>
                      <p className="text-sm text-gray-600">{booking.vendorSlug}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start justify-between py-4">
                  <div className="flex items-start">
                    <FiShoppingBag className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">
                        {booking.numberOfTickets}{" "}
                        {booking.numberOfTickets === 1 ? "ticket" : "tickets"}
                      </p>
                      <p className="text-sm text-gray-600">
                        ${parseFloat(booking.activity_base_price).toFixed(2)} per ticket
                      </p>
                    </div>
                  </div>
                </div>

                {/* Rental Items */}
                {costs.rentalItems && costs.rentalItems.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-3">Rental Equipment</h4>
                    <div className="space-y-2">
                      {costs.rentalItems.map((rental: RentalItem, index: number) => (
                        <div
                          key={index}
                          className="flex justify-between items-center bg-gray-50 p-3 rounded-lg"
                        >
                          <div>
                            <p className="font-medium text-gray-900">
                              {rental.quantity} × {rental.equipmentName}
                            </p>
                            <p className="text-sm text-gray-500">Size: {rental.sizeValue}</p>
                          </div>
                          <span className="font-semibold text-gray-900">
                            ${rental.itemTotal.toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border-l-4 border-blue-400 rounded-lg p-6 mb-8">
            <div className="flex items-start">
              <FiInfo className="w-6 h-6 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-blue-900 mb-2">Important Information</h4>
                <ul className="space-y-2 text-blue-800 text-sm">
                  <li>• Please arrive on time for your booking</li>
                  <li>• Bring exact change for cash payment at the venue</li>
                  <li>• Present your booking ID when you arrive</li>
                  <li>• Contact the venue if you need to make any changes</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center px-8 py-4 bg-sky-600 text-white font-semibold rounded-lg hover:bg-sky-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <FiHome className="w-5 h-5 mr-2" />
              Back to Home
            </Link>
            <Link
              href="/skiing"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-sky-600 font-semibold rounded-lg border-2 border-sky-600 hover:bg-sky-50 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <FiActivity className="w-5 h-5 mr-2" />
              Browse More Activities
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <header className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
            Complete Your Payment
          </h1>
          <div className="mt-3 max-w-md mx-auto">
            <p className="text-gray-600 text-lg">
              Review your booking and confirm payment
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
                <p className="text-red-800 font-medium">Payment Error</p>
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Summary */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6 md:p-8">
              <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                <FiCheckCircle className="mr-2 text-green-500" />
                Booking Summary
              </h2>

              <div className="space-y-6">
                {/* Customer Information */}
                <div className="border border-gray-100 rounded-lg p-5 bg-gray-50">
                  <div className="flex items-start">
                    <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center mr-4 flex-shrink-0">
                      <FiUser className="w-5 h-5 text-sky-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-700 mb-2 text-sm uppercase tracking-wider">
                        Customer Information
                      </h3>
                      <div className="space-y-1">
                        <p className="text-gray-900 font-medium">
                          {booking.user_name}
                        </p>
                        <div className="flex items-center text-gray-600 text-sm">
                          <FiMail className="w-4 h-4 mr-2" />
                          <span className="truncate">{booking.user_email}</span>
                        </div>
                        <div className="flex items-center text-gray-600 text-sm">
                          <FiPhone className="w-4 h-4 mr-2" />
                          <span>{booking.user_phone}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Date & Time */}
                <div className="border border-gray-100 rounded-lg p-5 bg-gray-50">
                  <div className="flex items-start">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-4 flex-shrink-0">
                      <FiCalendar className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-700 mb-2 text-sm uppercase tracking-wider">
                        Date & Time
                      </h3>
                      <div className="space-y-1">
                        <div className="flex items-center text-gray-900 font-medium">
                          <FiCalendar className="w-4 h-4 mr-2 text-gray-400" />
                          <span>{booking.bookingDate}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <FiClock className="w-4 h-4 mr-2 text-gray-400" />
                          <span>{booking.bookingTime}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Activity Zone */}
                <div className="border border-gray-100 rounded-lg p-5 bg-gray-50">
                  <div className="flex items-start">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-4 flex-shrink-0">
                      <FiMapPin className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-700 mb-2 text-sm uppercase tracking-wider">
                        Activity Zone
                      </h3>
                      <div className="space-y-1">
                        <p className="text-gray-900 font-medium">
                          {booking.zoneName || "Not specified"}
                        </p>
                        <p className="text-gray-600 text-sm">{booking.vendorSlug}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Activity Details */}
                <div className="border border-gray-100 rounded-lg p-5 bg-gray-50">
                  <div className="flex items-start">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-4 flex-shrink-0">
                      <FiShoppingBag className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-700 mb-2 text-sm uppercase tracking-wider">
                        Activity Details
                      </h3>
                      <div className="space-y-1">
                        <p className="text-gray-900 font-medium">
                          {booking.numberOfTickets}{" "}
                          {booking.numberOfTickets === 1 ? "ticket" : "tickets"} @
                          ${parseFloat(booking.activity_base_price).toFixed(2)}
                        </p>
                        <p className="text-gray-600 text-sm">
                          Activity ID: {booking.activityId}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Rental Items */}
                {costs.rentalItems && costs.rentalItems.length > 0 && (
                  <div className="border border-gray-100 rounded-lg p-5 bg-gray-50">
                    <h3 className="font-semibold text-gray-700 mb-4 text-sm uppercase tracking-wider">
                      Rental Equipment
                    </h3>
                    <div className="space-y-3">
                      {costs.rentalItems.map((rental: RentalItem, index: number) => (
                        <div
                          key={index}
                          className="flex justify-between items-center bg-white p-3 rounded-lg border border-gray-200"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900">
                              {rental.quantity} × {rental.equipmentName}
                            </p>
                            <p className="text-sm text-gray-500">
                              Size: {rental.sizeValue}
                            </p>
                          </div>
                          <span className="font-semibold text-gray-900 ml-4">
                            ${rental.itemTotal.toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Payment Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6 md:p-8 sticky top-6">
              <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                <FiDollarSign className="mr-2 text-green-500" />
                Payment Details
              </h2>

              {/* Cost Breakdown */}
              <div className="mb-6 space-y-3">
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Activity:</span>
                  <span className="font-medium text-gray-900">
                    ${costs.activityCost?.toFixed(2) || "0.00"}
                  </span>
                </div>

                {costs.rentalsTotal > 0 && (
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">Rental Equipment:</span>
                    <span className="font-medium text-gray-900">
                      ${costs.rentalsTotal.toFixed(2)}
                    </span>
                  </div>
                )}

                <div className="border-t border-gray-200 pt-3 mt-3">
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-700 font-medium">Subtotal:</span>
                    <span className="font-semibold text-gray-900">
                      ${costs.subtotal?.toFixed(2) || "0.00"}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-2">
                    <div className="flex items-center">
                      <span className="text-gray-700 font-medium">
                        Tax (HST 13%)
                      </span>
                      <div className="ml-2 inline-flex items-center text-xs text-gray-500">
                        <FiInfo className="w-3 h-3 mr-1" />
                        Included
                      </div>
                    </div>
                    <span className="font-semibold text-gray-900">
                      ${costs.tax?.toFixed(2) || "0.00"}
                    </span>
                  </div>
                </div>

                <div className="border-t-2 border-gray-300 pt-4 mt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">Total:</span>
                    <span className="text-2xl font-bold text-sky-600">
                      ${costs.total?.toFixed(2) || "0.00"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <FiShield className="w-5 h-5 mr-2 text-gray-400" />
                  Payment Method
                </h3>

                <div className="bg-gradient-to-br from-sky-50 to-blue-50 border-2 border-sky-200 rounded-xl p-4 mb-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mr-4 shadow-sm">
                      <FiDollarSign className="w-6 h-6 text-sky-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">Pay in Cash</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Pay at the venue when you arrive
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-6 rounded-lg">
                  <div className="flex items-start">
                    <FiInfo className="w-5 h-5 text-amber-600 mr-2 mt-0.5 flex-shrink-0" />
                    <p className="text-amber-800 text-sm">
                      Please bring exact change if possible. Your booking will
                      be confirmed immediately after payment.
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleConfirmPayment}
                  disabled={submitting}
                  className="w-full bg-sky-600 hover:bg-sky-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-lg shadow-lg transition-all transform hover:-translate-y-0.5 hover:shadow-xl disabled:transform-none flex items-center justify-center"
                >
                  {submitting ? (
                    <>
                      <FiLoader className="w-5 h-5 mr-2 animate-spin" />
                      Confirming...
                    </>
                  ) : (
                    <>
                      <FiCheckCircle className="w-5 h-5 mr-2" />
                      Confirm Cash Payment
                      <FiArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
