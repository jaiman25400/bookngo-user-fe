# Complete Booking Flow Documentation

## Overview
This document explains the complete booking flow from clicking "Book Now" on the activity detail page until payment confirmation. This can be used to replicate the same flow in a CMS where employees can make bookings for users.

---

## Step-by-Step Booking Flow

### **STEP 1: Activity Detail Page**
**Route:** `/vendor/{vendorSlug}/activities/{activityId}`
**File:** `src/app/(public)/vendor/[vendorDetail]/activities/[activityId]/page.tsx`

**What Happens:**
1. Page loads and displays activity details
2. User clicks "Book Now" button
3. User is redirected to booking form page

**API Called:**
- `GET /user/vendors/activity/{activityId}`
  - Fetches activity details (name, price, description, schedules, zones, etc.)
  - **Response includes:** Activity data with zones, schedules, holidays, pricing

**Data Retrieved:**
- Activity name, description, base price
- Activity schedules (days, times, duration)
- Activity zones (age groups, capacity, pricing)
- Activity holidays (specific dates and recurring days)
- Whether activity provides rentals

---

### **STEP 2: Booking Form Page**
**Route:** `/vendor/{vendorSlug}/activities/{activityId}/book`
**File:** `src/app/(public)/vendor/[vendorDetail]/activities/[activityId]/book/page.tsx`

**What Happens:**
1. Page displays booking form
2. User fills in customer information:
   - **Name** (required, min 2 characters)
   - **Email** (required, valid email format)
   - **Phone** (required, valid phone format, min 10 digits)
   - **Number of Tickets** (required, 1-20 tickets)

**Validation Rules:**
- Name: Required, minimum 2 characters
- Email: Required, must match email regex pattern
- Phone: Required, must contain at least 10 digits (allows spaces, dashes, parentheses)
- Tickets: Required, must be between 1 and 20

**No API Called Yet** - Only client-side validation

**Data Collected:**
```typescript
{
  name: string;
  email: string;
  phone: string;
  tickets: number;
  activityId: string;  // From URL
  vendorSlug: string;  // From URL
}
```

**Storage:**
- Data saved to `sessionStorage` with key: `"booking-data"`
- Data also saved to cookie: `booking-data` (expires in 1 hour)
- User redirected to `/booking-confirmation`

---

### **STEP 3: Booking Confirmation Page**
**Route:** `/booking-confirmation`
**File:** `src/app/(public)/booking-confirmation/page.tsx`

#### **3.1 Load Booking Data**
- Retrieves booking data from `sessionStorage` or cookie
- If no data found → shows error

#### **3.2 Fetch Activity Details**
**API Called:**
- `GET /user/vendors/activity/{activityId}`
  - **Endpoint:** `/user/vendors/activity/{activityId}`
  - **Purpose:** Get full activity details including zones, schedules, holidays
  - **Response includes:**
    - `activity_name`
    - `zones[]` (id, name, description, age_group, capacity, price, status)
    - `schedules[]` (day, start_time, end_time, duration, is_24hours, is_holiday, price)
    - `holidays[]` (date)
    - `start_date`, `end_date`
    - `provides_rentals` (boolean)
    - `slot_interval_minutes`
    - `max_per_slot`

**Data Used:**
- Filters zones where `status === "active"`
- Processes holiday dates (specific dates + recurring weekly holidays)
- Determines if rentals are available

#### **3.3 Select Date**
- User selects a date using DatePicker
- **Date Validation:**
  - Cannot select dates before activity `start_date`
  - Cannot select dates after activity `end_date`
  - Excludes specific holiday dates from `holidays[]`
  - Excludes recurring weekly holidays from `schedules[]` where `is_holiday === true`
  - Cannot select past dates

#### **3.4 Fetch Available Time Slots**
**API Called:** (Triggered when date is selected)
- `GET /user/bookings/check-availability?date={date}&activityId={activityId}`
  - **Endpoint:** `/user/bookings/check-availability`
  - **Query Parameters:**
    - `date`: Selected date in ISO format (YYYY-MM-DD)
    - `activityId`: Activity ID
  - **Response Format:**
    ```json
    {
      "success": true,
      "data": {
        "slots": [
          {
            "slotTime": "09:00:00",
            "availableTickets": 10
          },
          {
            "slotTime": "10:00:00",
            "availableTickets": 5
          }
        ]
      }
    }
    ```
  - **Shows:** Available time slots with remaining ticket count for selected date

#### **3.5 Select Time Slot**
- User selects a time slot from dropdown
- Slots with insufficient tickets (less than requested) are disabled

#### **3.6 Select Activity Zone**
- After time selection, user selects an activity zone
- **Zones Displayed:**
  - Only zones with `status === "active"`
  - Shows zone name, description, age group, price, thumbnail image
- User clicks on a zone card to select

#### **3.7 Rental Selection (Optional)**
**Condition:** Only shown if `provides_rentals === true`

**API Called:** (When "Select Rentals" button clicked)
- `GET /user/bookings/rentals/customerSlug?slug={vendorSlug}&bookingDate={date}&bookingTime={time}&activityId={activityId}`
  - **Endpoint:** `/user/bookings/rentals/customerSlug`
  - **Query Parameters:**
    - `slug`: Vendor slug
    - `bookingDate`: Selected date in ISO format
    - `bookingTime`: Selected time slot
    - `activityId`: Activity ID
  - **Purpose:** Get available rental inventory for the selected date/time

**Rental Modal Opens:**
- Shows available rental equipment
- User selects equipment, size, and quantity
- User can continue without rentals or with selected rentals

#### **3.8 Submit Booking**
**API Called:** (When "Continue to Payment" clicked)
- `POST /user/bookings/proceedToCheckout`
  - **Endpoint:** `/user/bookings/proceedToCheckout`
  - **Method:** POST
  - **Request Body:**
    ```json
    {
      "userDetails": {
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "555-123-4567"
      },
      "activityId": "123",
      "vendorSlug": "boler-mountain",
      "tickets": 2,
      "date": "2024-01-15",
      "time": "09:00:00",
      "zoneId": 1,
      "zoneName": "Adult Zone",
      "rentals": [
        {
          "equipmentId": 5,
          "equipmentName": "Ski Boots",
          "sizeValue": "Large",
          "sizeId": 3,
          "quantity": 1,
          "price": "25.00"
        }
      ]
    }
    ```
  - **Response:**
    ```json
    {
      "BookingID": "898b619d-c183-4280-9cb1-6c1c6bc9d6ca"
    }
    ```

**What Happens:**
- Booking ID saved to `sessionStorage` with key: `"bookingId"`
- User redirected to checkout page: `/checkout?bookingId={bookingId}`

---

### **STEP 4: Checkout/Payment Page**
**Route:** `/checkout?bookingId={bookingId}`
**File:** `src/app/(public)/checkout/page.tsx`

#### **4.1 Load Booking Details**
**API Called:**
- `GET /user/bookings/bookingID?id={bookingId}`
  - **Endpoint:** `/user/bookings/bookingID`
  - **Query Parameter:** `id` = bookingId
  - **Response includes:**
    - User details (name, email, phone)
    - Booking date and time
    - Zone name
    - Number of tickets
    - Activity base price
    - Cost breakdown:
      - Activity cost
      - Rental equipment costs (if any)
      - Subtotal
      - Tax (HST 13%)
      - Total

**Data Displayed:**
- Complete booking summary
- Cost breakdown with subtotal and tax
- Payment method (Cash)

#### **4.2 Confirm Cash Payment**
**API Called:** (When "Confirm Cash Payment" clicked)
- `POST /user/bookings/confirmBooking`
  - **Endpoint:** `/user/bookings/confirmBooking`
  - **Method:** POST
  - **Request Body:**
    ```json
    {
      "bookingId": "898b619d-c183-4280-9cb1-6c1c6bc9d6ca"
    }
    ```
  - **Purpose:** Confirms the booking and marks payment as confirmed in database

**What Happens:**
- Booking confirmation stored in database
- Success screen displayed with booking confirmation
- Booking ID removed from sessionStorage after 5 seconds
- User can navigate home or browse more activities

---

## Complete API Summary

### 1. **Get Activity Details**
```
GET /user/vendors/activity/{activityId}
```
**Used in:** Step 1 (Activity Page), Step 3.2 (Booking Confirmation)

### 2. **Check Slot Availability**
```
GET /user/bookings/check-availability?date={date}&activityId={activityId}
```
**Used in:** Step 3.4 (Date Selection)

### 3. **Get Rental Inventory**
```
GET /user/bookings/rentals/customerSlug?slug={slug}&bookingDate={date}&bookingTime={time}&activityId={activityId}
```
**Used in:** Step 3.7 (Rental Selection)

### 4. **Create Booking (Submit Checkout)**
```
POST /user/bookings/proceedToCheckout
Body: {
  userDetails: { name, email, phone },
  activityId, vendorSlug, tickets,
  date, time, zoneId, zoneName,
  rentals: [{ equipmentId, equipmentName, sizeValue, sizeId, quantity, price }]
}
```
**Used in:** Step 3.8 (Submit Booking)
**Returns:** `{ BookingID: "uuid" }`

### 5. **Get Booking Details**
```
GET /user/bookings/bookingID?id={bookingId}
```
**Used in:** Step 4.1 (Checkout Page)

### 6. **Confirm Payment**
```
POST /user/bookings/confirmBooking
Body: { bookingId }
```
**Used in:** Step 4.2 (Payment Confirmation)

---

## Data Storage During Flow

### SessionStorage Keys:
- `"booking-data"`: Initial booking form data (name, email, phone, tickets, activityId, vendorSlug)
- `"bookingId"`: Booking ID returned from `proceedToCheckout` API

### Cookie:
- `booking-data`: Backup storage for booking form data (1 hour expiry)

---

## For CMS Implementation

To replicate this flow in CMS, you'll need to:

1. **Create a booking form interface** that collects:
   - Customer name, email, phone
   - Number of tickets
   - Activity selection
   - Date and time selection
   - Zone selection
   - Optional rental selection

2. **Call the same APIs in the same order:**
   - Fetch activity details
   - Check availability for selected date
   - Get rental inventory (if needed)
   - Submit booking via `proceedToCheckout`
   - Confirm payment via `confirmBooking`

3. **Handle all validations:**
   - Date constraints (activity start/end dates, holidays)
   - Slot availability
   - Zone availability
   - Rental inventory availability

4. **Store booking ID** for confirmation

5. **Display booking confirmation** after payment confirmation

---

## Important Notes

- **Date Format:** All dates should be in ISO format (YYYY-MM-DD)
- **Time Format:** Time slots are in 24-hour format (HH:MM:SS)
- **Holiday Logic:** Both specific dates and recurring weekly holidays are excluded
- **Zone Status:** Only zones with `status === "active"` are selectable
- **Slot Availability:** Checked dynamically when date is selected
- **Rentals:** Optional, only available if `provides_rentals === true`
- **Tax Calculation:** HST 13% applied on subtotal
- **Payment:** Currently only cash payment supported

---

## Error Handling

Each API call should handle:
- Network errors
- Timeout errors (10 second timeout)
- 404 errors (not found)
- 500 errors (server errors)
- Invalid response format

Error states are displayed to users with appropriate messages and retry options.
