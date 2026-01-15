"use client";

import React, { useState, useEffect } from "react";
import { fetchInventoryUsingCustomerSlug } from "../lib/bookingApi";
import {
  FiX,
  FiShoppingBag,
  FiPlus,
  FiMinus,
  FiLoader,
  FiAlertCircle,
  FiCheckCircle,
  FiRefreshCw,
} from "react-icons/fi";
import Image from "next/image";

type RentalSelection = {
  inventoryId: number;
  sizeId: number;
  quantity: number;
  equipmentName: string;
  size: string;
  price: string;
};

type RentalModalProps = {
  onClose: () => void;
  onConfirm: (selections: RentalSelection[]) => void;
  clientSlug: string;
  bookingDate: Date | null;
  bookingTime: string | null;
  activityId: string | null;
};

interface InventorySize {
  id: number;
  size: string;
  description?: string;
  availableQuantity: number;
}

interface InventoryItem {
  id: number;
  equipment_name: string;
  rental_price_per_hour: string;
  equipment_image?: string;
  sizes: InventorySize[];
}

export default function RentalModal({
  onClose,
  onConfirm,
  clientSlug,
  bookingDate,
  bookingTime,
  activityId,
}: RentalModalProps) {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selections, setSelections] = useState<
    Record<string, Record<string, number>>
  >({});
  const [retrying, setRetrying] = useState(false);

  useEffect(() => {
    const fetchInventory = async () => {
      if (!clientSlug || !bookingDate || !bookingTime || !activityId) {
        setError("Missing required booking information.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await fetchInventoryUsingCustomerSlug(
          clientSlug,
          bookingDate,
          bookingTime,
          activityId
        );

        if (response.error) {
          setError(
            response.error ||
              "Failed to load rental inventory. Please try again."
          );
        } else if (response.data) {
          if (Array.isArray(response.data) && response.data.length > 0) {
            setInventory(response.data);
          } else if (Array.isArray(response.data) && response.data.length === 0) {
            setError("No rental equipment available for this booking.");
          } else {
            setError("Invalid inventory data received.");
          }
        } else {
          setError("No inventory data found.");
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "An unexpected error occurred while loading inventory."
        );
      } finally {
        setLoading(false);
        setRetrying(false);
      }
    };

    fetchInventory();
  }, [clientSlug, bookingDate, bookingTime, activityId]);

  const handleRetry = () => {
    setRetrying(true);
    setError(null);
    const fetchInventory = async () => {
      if (!clientSlug || !bookingDate || !bookingTime || !activityId) {
        setError("Missing required booking information.");
        setRetrying(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetchInventoryUsingCustomerSlug(
          clientSlug,
          bookingDate,
          bookingTime,
          activityId
        );

        if (response.error) {
          setError(
            response.error ||
              "Failed to load rental inventory. Please try again."
          );
        } else if (response.data) {
          if (Array.isArray(response.data) && response.data.length > 0) {
            setInventory(response.data);
            setError(null);
          } else if (Array.isArray(response.data) && response.data.length === 0) {
            setError("No rental equipment available for this booking.");
          } else {
            setError("Invalid inventory data received.");
          }
        } else {
          setError("No inventory data found.");
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "An unexpected error occurred while loading inventory."
        );
      } finally {
        setLoading(false);
        setRetrying(false);
      }
    };

    fetchInventory();
  };

  const handleQuantityChange = (
    inventoryId: number,
    sizeId: number,
    value: number
  ) => {
    setSelections((prev) => ({
      ...prev,
      [inventoryId]: {
        ...(prev[inventoryId] || {}),
        [sizeId]: Math.max(0, value),
      },
    }));
  };

  const handleConfirm = () => {
    const selectedItems: RentalSelection[] = [];

    Object.keys(selections).forEach((invId) => {
      const inv = inventory.find((item) => item.id === parseInt(invId));
      if (!inv) return;

      Object.keys(selections[invId]).forEach((sizeId) => {
        const quantity = selections[invId][sizeId];
        if (quantity > 0) {
          const sizeObj = inv.sizes.find(
            (s: InventorySize) => s.id === parseInt(sizeId)
          );
          if (sizeObj) {
            selectedItems.push({
              inventoryId: parseInt(invId),
              sizeId: parseInt(sizeId),
              quantity,
              equipmentName: inv.equipment_name,
              size: sizeObj.size,
              price: inv.rental_price_per_hour,
            });
          }
        }
      });
    });

    onConfirm(selectedItems);
    onClose();
  };

  const getTotalSelected = () => {
    let total = 0;
    Object.values(selections).forEach((sizeSelections) => {
      Object.values(sizeSelections).forEach((qty) => {
        total += qty;
      });
    });
    return total;
  };

  const getTotalPrice = () => {
    let total = 0;
    Object.keys(selections).forEach((invId) => {
      const inv = inventory.find((item) => item.id === parseInt(invId));
      if (!inv) return;

      Object.keys(selections[invId]).forEach((sizeId) => {
        const quantity = selections[invId][sizeId];
        if (quantity > 0) {
          total += parseFloat(inv.rental_price_per_hour) * quantity;
        }
      });
    });
    return total;
  };

  const hasSelections = getTotalSelected() > 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-sky-50 to-blue-50">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-sky-600 flex items-center justify-center mr-3">
              <FiShoppingBag className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Select Rental Equipment
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Choose equipment and sizes for your booking
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-600 hover:text-gray-900"
            aria-label="Close modal"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-sky-100 mb-4">
                <FiLoader className="w-8 h-8 text-sky-600 animate-spin" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Loading Rental Inventory
              </h3>
              <p className="text-gray-600 text-center max-w-md">
                Please wait while we fetch available rental equipment for your
                selected date and time.
              </p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
                <FiAlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Unable to Load Inventory
              </h3>
              <p className="text-gray-600 text-center max-w-md mb-6">{error}</p>
              <div className="flex gap-3">
                <button
                  onClick={handleRetry}
                  disabled={retrying}
                  className="inline-flex items-center px-6 py-3 bg-sky-600 hover:bg-sky-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors shadow-md hover:shadow-lg"
                >
                  {retrying ? (
                    <>
                      <FiLoader className="w-5 h-5 mr-2 animate-spin" />
                      Retrying...
                    </>
                  ) : (
                    <>
                      <FiRefreshCw className="w-5 h-5 mr-2" />
                      Try Again
                    </>
                  )}
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          ) : inventory.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-100 mb-4">
                <FiShoppingBag className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Rental Equipment Available
              </h3>
              <p className="text-gray-600 text-center max-w-md mb-6">
                There are no rental equipment options available for your selected
                date and time. You can continue without rentals.
              </p>
              <button
                onClick={onClose}
                className="px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-medium rounded-lg transition-colors shadow-md hover:shadow-lg"
              >
                Continue Without Rentals
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {inventory.map((item) => (
                  <div
                    key={item.id}
                    className="border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-all duration-200 bg-white"
                  >
                    <div className="flex items-start gap-4 mb-4">
                      {item.equipment_image ? (
                        <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
                          <Image
                            src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${item.equipment_image}`}
                            alt={item.equipment_name}
                            fill
                            className="object-cover"
                            sizes="80px"
                            loading="lazy"
                            quality={80}
                          />
                        </div>
                      ) : (
                        <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-sky-100 to-blue-100 flex items-center justify-center flex-shrink-0">
                          <FiShoppingBag className="w-8 h-8 text-sky-600" />
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-lg text-gray-900 mb-1">
                          {item.equipment_name}
                        </h3>
                        <p className="text-sky-600 font-semibold">
                          ${parseFloat(item.rental_price_per_hour).toFixed(2)}
                          <span className="text-gray-600 text-sm font-normal">
                            {" "}
                            /hour
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="mt-4">
                      <h4 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wider">
                        Available Sizes
                      </h4>
                      <div className="space-y-3">
                        {item.sizes && item.sizes.length > 0 ? (
                          item.sizes.map((size: InventorySize) => {
                            const quantity =
                              selections[item.id]?.[size.id] || 0;
                            const isAvailable = size.availableQuantity > 0;
                            const isMaxReached =
                              quantity >= size.availableQuantity;

                            return (
                              <div
                                key={size.id}
                                className={`border rounded-lg p-3 transition-colors ${
                                  isAvailable
                                    ? "border-gray-200 bg-white"
                                    : "border-gray-100 bg-gray-50 opacity-60"
                                }`}
                              >
                                <div className="flex justify-between items-start mb-2">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                      <span className="font-semibold text-gray-900">
                                        Size: {size.size}
                                      </span>
                                      {!isAvailable && (
                                        <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                                          Out of Stock
                                        </span>
                                      )}
                                    </div>
                                    {size.description && (
                                      <p className="text-xs text-gray-500 mt-1">
                                        {size.description}
                                      </p>
                                    )}
                                  </div>
                                </div>

                                <div className="flex items-center justify-between">
                                  <div className="text-xs text-gray-600">
                                    {isAvailable
                                      ? `${size.availableQuantity} available`
                                      : "Not available"}
                                  </div>

                                  {isAvailable && (
                                    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                                      <button
                                        onClick={() =>
                                          handleQuantityChange(
                                            item.id,
                                            size.id,
                                            quantity - 1
                                          )
                                        }
                                        disabled={quantity <= 0}
                                        className="bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-300 disabled:cursor-not-allowed text-gray-700 w-9 h-9 flex items-center justify-center transition-colors"
                                        aria-label="Decrease quantity"
                                      >
                                        <FiMinus className="w-4 h-4" />
                                      </button>

                                      <input
                                        type="number"
                                        min="0"
                                        max={size.availableQuantity}
                                        value={quantity}
                                        onChange={(e) => {
                                          let val = parseInt(e.target.value) || 0;
                                          if (val < 0) val = 0;
                                          if (val > size.availableQuantity)
                                            val = size.availableQuantity;
                                          handleQuantityChange(
                                            item.id,
                                            size.id,
                                            val
                                          );
                                        }}
                                        className="w-14 h-9 border-y border-gray-300 text-center font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                                        readOnly={size.availableQuantity === 0}
                                      />

                                      <button
                                        onClick={() =>
                                          handleQuantityChange(
                                            item.id,
                                            size.id,
                                            Math.min(
                                              quantity + 1,
                                              size.availableQuantity
                                            )
                                          )
                                        }
                                        disabled={isMaxReached}
                                        className="bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-300 disabled:cursor-not-allowed text-gray-700 w-9 h-9 flex items-center justify-center transition-colors"
                                        aria-label="Increase quantity"
                                      >
                                        <FiPlus className="w-4 h-4" />
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <p className="text-sm text-gray-500 text-center py-2">
                            No sizes available for this item
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {!loading && !error && inventory.length > 0 && (
          <div className="border-t border-gray-200 bg-gray-50 p-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-6">
                <div className="text-gray-700">
                  <span className="font-semibold text-gray-900">
                    {getTotalSelected()}
                  </span>{" "}
                  {getTotalSelected() === 1 ? "item" : "items"} selected
                </div>
                {hasSelections && (
                  <div className="text-gray-700">
                    Total:{" "}
                    <span className="font-bold text-sky-600 text-lg">
                      ${getTotalPrice().toFixed(2)}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex gap-3 w-full sm:w-auto">
                <button
                  onClick={onClose}
                  className="flex-1 sm:flex-none px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={!hasSelections}
                  className="flex-1 sm:flex-none px-6 py-3 bg-sky-600 hover:bg-sky-700 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-lg text-white font-semibold transition-all shadow-md hover:shadow-lg disabled:shadow-none flex items-center justify-center"
                >
                  {hasSelections ? (
                    <>
                      <FiCheckCircle className="w-5 h-5 mr-2" />
                      Confirm Rentals
                    </>
                  ) : (
                    "Select Items to Continue"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
