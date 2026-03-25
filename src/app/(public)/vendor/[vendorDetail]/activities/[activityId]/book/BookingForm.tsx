"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { FiUser, FiMail, FiPhone, FiShoppingCart, FiAlertCircle } from "react-icons/fi";

interface BookingFormProps {
  activityId: string;
  vendorSlug: string;
  /** When true, activity admission is free; tickets field is hidden and stored as 0. */
  freeAdmission?: boolean;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  tickets: number;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  tickets?: string;
  submit?: string;
}

export default function BookingForm({
  activityId,
  vendorSlug,
  freeAdmission = false,
}: BookingFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    tickets: freeAdmission ? 0 : 1,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = "Please enter a valid email address";
      }
    }

    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else {
      const phoneRegex = /^[\d\s\-\+\(\)]+$/;
      if (!phoneRegex.test(formData.phone) || formData.phone.replace(/\D/g, "").length < 10) {
        newErrors.phone = "Please enter a valid phone number";
      }
    }

    // Tickets validation (skipped for free-admission activities)
    if (!freeAdmission) {
      if (formData.tickets < 1 || formData.tickets > 20) {
        newErrors.tickets = "Number of tickets must be between 1 and 20";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newValue = name === "tickets" ? parseInt(value) || 0 : value;

    setFormData((prev) => ({ ...prev, [name]: newValue }));

    // Clear error for this field when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const bookingDetails = {
        ...formData,
        tickets: freeAdmission ? 0 : formData.tickets,
        freeAdmission,
        activityId,
        vendorSlug,
      };

      // Save to sessionStorage (immediately available)
      if (typeof window !== "undefined") {
        sessionStorage.setItem("booking-data", JSON.stringify(bookingDetails));

        // Set cookie for persistence on refresh
        document.cookie = `booking-data=${encodeURIComponent(
          JSON.stringify(bookingDetails)
        )}; path=/booking-confirmation; max-age=${60 * 60}; SameSite=Lax`;
      }

      router.push("/booking-confirmation");
    } catch (error) {
      setErrors({
        submit:
          error instanceof Error
            ? error.message
            : "An error occurred. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name Field */}
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-semibold text-gray-700 mb-2"
        >
          <FiUser className="inline-block w-4 h-4 mr-2" />
          Full Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-colors ${
            errors.name
              ? "border-red-300 bg-red-50"
              : "border-gray-300 hover:border-gray-400"
          }`}
          placeholder="John Doe"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600 flex items-center">
            <FiAlertCircle className="w-4 h-4 mr-1" />
            {errors.name}
          </p>
        )}
      </div>

      {/* Email Field */}
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-semibold text-gray-700 mb-2"
        >
          <FiMail className="inline-block w-4 h-4 mr-2" />
          Email Address
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-colors ${
            errors.email
              ? "border-red-300 bg-red-50"
              : "border-gray-300 hover:border-gray-400"
          }`}
          placeholder="john.doe@example.com"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600 flex items-center">
            <FiAlertCircle className="w-4 h-4 mr-1" />
            {errors.email}
          </p>
        )}
      </div>

      {/* Phone Field */}
      <div>
        <label
          htmlFor="phone"
          className="block text-sm font-semibold text-gray-700 mb-2"
        >
          <FiPhone className="inline-block w-4 h-4 mr-2" />
          Phone Number
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-colors ${
            errors.phone
              ? "border-red-300 bg-red-50"
              : "border-gray-300 hover:border-gray-400"
          }`}
          placeholder="(555) 123-4567"
        />
        {errors.phone && (
          <p className="mt-1 text-sm text-red-600 flex items-center">
            <FiAlertCircle className="w-4 h-4 mr-1" />
            {errors.phone}
          </p>
        )}
      </div>

      {/* Tickets — hidden when admission is free (rentals chosen later) */}
      {!freeAdmission && (
        <div>
          <label
            htmlFor="tickets"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            <FiShoppingCart className="inline-block w-4 h-4 mr-2" />
            Number of Tickets
          </label>
          <input
            type="number"
            id="tickets"
            name="tickets"
            min="1"
            max="20"
            value={formData.tickets}
            onChange={handleChange}
            required
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-colors ${
              errors.tickets
                ? "border-red-300 bg-red-50"
                : "border-gray-300 hover:border-gray-400"
            }`}
          />
          {errors.tickets && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <FiAlertCircle className="w-4 h-4 mr-1" />
              {errors.tickets}
            </p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            Maximum 20 tickets per booking
          </p>
        </div>
      )}

      {/* Submit Error */}
      {errors.submit && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-600 flex items-center">
            <FiAlertCircle className="w-4 h-4 mr-2" />
            {errors.submit}
          </p>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-sky-600 hover:bg-sky-700 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none flex items-center justify-center"
      >
        {isSubmitting ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Processing...
          </>
        ) : freeAdmission ? (
          "Continue to rental booking"
        ) : (
          "Continue to Booking Details"
        )}
      </button>
    </form>
  );
}
