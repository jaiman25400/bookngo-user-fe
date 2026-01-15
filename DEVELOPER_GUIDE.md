# BookNGo User - Developer Guide

A comprehensive guide to understanding, setting up, and developing the BookNGo User application.

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Development Workflow](#development-workflow)
- [Architecture Overview](#architecture-overview)
- [Key Features](#key-features)
- [API Integration](#api-integration)
- [Routing Structure](#routing-structure)
- [Common Tasks](#common-tasks)
- [Troubleshooting](#troubleshooting)

---

## 🎯 Project Overview

**BookNGo User** is a Next.js-based web application that enables users to discover, browse, and book winter activities (primarily skiing and ice skating) across Canada. The application provides:

- **Activity Discovery**: Browse skiing slopes, skating rings, and various winter activities
- **Vendor Pages**: Explore detailed vendor/venue information
- **Booking System**: Complete booking flow with date/time selection, zone selection, and rental equipment
- **Checkout**: Payment confirmation and booking management

The application follows Next.js 15 App Router architecture with TypeScript and Tailwind CSS for styling.

---

## 🛠 Tech Stack

### Core Technologies
- **Framework**: Next.js 15.3.1 (App Router)
- **Language**: TypeScript 5
- **UI Library**: React 19.0.0
- **Styling**: Tailwind CSS 4.1.6
- **Icons**: React Icons (Feather Icons)

### Key Dependencies
- **Date Handling**: `date-fns` ^4.1.0
- **Date Picker**: `react-datepicker` ^8.4.0
- **Maps**: `mapbox-gl` ^3.12.0
- **Cookies**: `js-cookie` ^3.0.5
- **Icons**: `react-icons` ^5.5.0, `@heroicons/react` ^2.2.0

### Development Tools
- **Linting**: ESLint with Next.js config
- **Build Tool**: Next.js built-in bundler
- **CSS Processing**: PostCSS with Autoprefixer

---

## 📁 Project Structure

```
bookngo-user/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (root)/                   # Root route group (Home page)
│   │   │   ├── layout.tsx            # Root layout
│   │   │   └── page.tsx              # Home page
│   │   ├── (public)/                 # Public routes group
│   │   │   ├── activities/           # Activities listing page
│   │   │   ├── skiing/               # Skiing slopes page
│   │   │   ├── skates/               # Skating rings page
│   │   │   ├── [regionSlug]/         # Dynamic region page
│   │   │   ├── vendor/               # Vendor pages
│   │   │   │   └── [vendorDetail]/   # Dynamic vendor detail page
│   │   │   │       └── activities/
│   │   │   │           └── [activityId]/  # Activity detail & booking
│   │   │   ├── booking-confirmation/ # Booking confirmation flow
│   │   │   ├── checkout/             # Payment/checkout page
│   │   │   ├── login/                # Login page (placeholder)
│   │   │   ├── signup/               # Signup page (placeholder)
│   │   │   └── lib/
│   │   │       └── bookingApi.ts     # Booking-related API functions
│   │   ├── (protected)/              # Protected routes (empty, for future use)
│   │   ├── layout.tsx                # Root layout with Navbar
│   │   ├── globals.css               # Global styles
│   │   └── utils/                    # Utility functions
│   └── components/                   # Reusable React components
│       ├── Navbar.tsx                # Navigation bar
│       ├── RegionCard.tsx            # Region card component
│       ├── RegionsScroll.tsx         # Regions scrolling section
│       ├── LoadingSkeleton.tsx       # Loading state component
│       └── Bookings/
│           └── CalendarPicker.tsx    # Calendar picker component
├── public/                           # Static assets
│   └── images/
│       └── home-bg.jpg               # Home page background
├── next.config.ts                    # Next.js configuration
├── tailwind.config.ts                # Tailwind CSS configuration
├── tsconfig.json                     # TypeScript configuration
├── eslint.config.mjs                 # ESLint configuration
├── package.json                      # Dependencies and scripts
└── README.md                         # Basic Next.js README

```

### Route Groups Explained

- **`(root)`**: Contains the home page (`/`) - uses parentheses to organize without affecting URL
- **`(public)`**: All public-facing pages (browsing, booking, checkout)
- **`(protected)`**: Future protected routes (authentication required)

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: Version 18.x or higher (recommended: 20.x)
- **npm**: Version 9.x or higher (comes with Node.js)
- **Git**: For version control

### Verify Installation

```bash
node --version    # Should show v18.x or higher
npm --version     # Should show 9.x or higher
```

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd bookngo-user
```

### 2. Install Dependencies

```bash
npm install
```

This will install all dependencies listed in `package.json`.

### 3. Set Up Environment Variables

Create a `.env.local` file in the root directory (see [Environment Variables](#environment-variables) section).

### 4. Run the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

### 5. Alternative Port (Optional)

If you need to run on a different port:

```bash
npm run start:user-frontend
```

This runs the server on port **3002** instead of the default 3000.

---

## 🔐 Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000

# Mapbox (for map features)
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token_here
```

### Environment Variable Notes

- **`NEXT_PUBLIC_API_URL`**: Base URL for API endpoints (used in booking APIs)
- **`NEXT_PUBLIC_API_BASE_URL`**: Base URL for API endpoints (used in activity/vendor APIs)
- **`NEXT_PUBLIC_MAPBOX_TOKEN`**: Mapbox API token for map rendering (used in skiing page)

> **Note**: Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser. Never put sensitive keys here.

### Default Values

If environment variables are not set, the code defaults to:
- API URLs: `http://localhost:3000`
- Mapbox Token: Empty string (maps may not work)

---

## 🔄 Development Workflow

### Available Scripts

```bash
# Start development server (port 3000)
npm run dev

# Start development server (port 3002)
npm run start:user-frontend

# Build for production
npm run build

# Start production server
npm run start

# Run ESLint
npm run lint
```

### Development Server Features

- **Hot Reload**: Changes automatically refresh the browser
- **Fast Refresh**: React components update without losing state
- **Error Overlay**: Errors displayed in browser with stack traces

---

## 🏗 Architecture Overview

### App Router Structure

The application uses Next.js 15 App Router with the following patterns:

1. **Route Groups**: `(root)`, `(public)`, `(protected)` - organize routes without affecting URLs
2. **Dynamic Routes**: `[regionSlug]`, `[vendorDetail]`, `[activityId]` - handle dynamic parameters
3. **Server & Client Components**: Mix of server and client components based on needs

### Component Architecture

- **Server Components** (default): Used for data fetching and static content
- **Client Components** (`"use client"`): Used for interactivity, state, and browser APIs

### State Management

- **Local State**: React `useState` for component-level state
- **Session Storage**: Used for temporary booking data persistence
- **Cookies**: Used for booking data persistence across page refreshes

### Data Flow

```
User Action → Client Component → API Call → Backend API → Response → UI Update
```

---

## ✨ Key Features

### 1. Activity Discovery

- **Skiing Slopes**: Browse skiing venues with map integration
- **Skating Rings**: Browse ice skating venues
- **Activities**: General activities listing
- **Regions**: Browse activities by region

### 2. Vendor & Activity Pages

- Detailed vendor information
- Activity listings per vendor
- Activity details with scheduling information
- Zone selection for activities

### 3. Booking Flow

The booking process follows these steps:

1. **Activity Selection**: User selects an activity from vendor page
2. **Booking Form**: User enters name, email, phone, and ticket count
3. **Date Selection**: User picks an available date
4. **Time Slot Selection**: User selects from available time slots
5. **Zone Selection**: User selects activity zone (if multiple zones available)
6. **Rental Selection**: Optional rental equipment selection
7. **Checkout**: Review and confirm booking
8. **Payment**: Confirm cash payment

### 4. Booking Confirmation

- Date/time availability checking
- Slot availability validation
- Zone selection with pricing
- Optional rental equipment booking
- Booking summary before checkout

### 5. Checkout & Payment

- Booking summary display
- Cost breakdown (activity, rentals, tax)
- Payment confirmation (cash payment)
- Booking ID management

---

## 🌐 API Integration

### API Base URLs

The application uses different environment variables for API calls:

- **`NEXT_PUBLIC_API_URL`**: Used in `bookingApi.ts`
- **`NEXT_PUBLIC_API_BASE_URL`**: Used in region, skiing, and vendor APIs

> **Note**: This inconsistency should be standardized in future updates.

### API Structure

APIs are organized by feature:

- **Booking APIs** (`src/app/(public)/lib/bookingApi.ts`):
  - `getBookingDetailsByBookingID()`
  - `confirmCashPayment()`
  - `fetchActivityDetailsUsingNonOfTickets()`
  - `fetchInventoryUsingCustomerSlug()`
  - `fetchSlotAvailableUsingDate()`
  - `submitUserCheckOutData()`

- **Vendor APIs** (`src/app/(public)/vendor/[vendorDetail]/vendorDetailApi.tsx`):
  - `fetchVendorDetailByName()`

- **Activity APIs** (`src/app/(public)/vendor/[vendorDetail]/activities/[activityId]/vendorActivityApi.ts`):
  - `fetchVendorActivityByID()`

- **Skiing APIs** (`src/app/(public)/skiing/skiingApi.ts`):
  - `fetchSkiingData()`

- **Region APIs** (`src/app/(public)/[regionSlug]/regionApi.tsx`):
  - `fetchRegionResorts()`

### API Response Pattern

Most APIs follow this pattern:

```typescript
interface ApiResponse<T> {
  data?: T;
  error?: string;
}
```

### API Endpoints (Expected)

Based on the code, the backend should provide:

- `GET /user/ski-slopes/skiing-customers` - List skiing venues
- `GET /user/ski-slopes?region={region}` - List venues by region
- `GET /user/vendors/customerSlug/?slug={slug}` - Vendor details
- `GET /user/vendors/activity/{activityId}` - Activity details
- `GET /user/bookings/check-availability?date={date}&activityId={id}` - Slot availability
- `GET /user/bookings/rentals/customerSlug?slug={slug}&...` - Rental inventory
- `POST /user/bookings/proceedToCheckout` - Create booking
- `GET /user/bookings/bookingID?id={bookingId}` - Get booking details
- `POST /user/bookings/confirmBooking` - Confirm payment

---

## 🛣 Routing Structure

### Public Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | HomePage | Landing page with hero and regions |
| `/skiing` | SkiingPage | Ski slopes listing with map |
| `/skates` | SkatesPage | Skating rings listing |
| `/activities` | ActivitiesPage | Activities listing |
| `/[regionSlug]` | RegionPage | Region-specific resorts |
| `/vendor/[vendorDetail]` | VendorPage | Vendor detail page |
| `/vendor/[vendorDetail]/activities/[activityId]` | ActivityPage | Activity detail page |
| `/vendor/[vendorDetail]/activities/[activityId]/book` | BookingForm | Booking form |
| `/booking-confirmation` | BookingConfirmationPage | Complete booking flow |
| `/checkout` | PaymentPage | Payment and checkout |
| `/login` | LoginPage | Login (placeholder) |
| `/signup` | SignupPage | Signup (placeholder) |

### Route Parameters

- **`[regionSlug]`**: URL-friendly region identifier
- **`[vendorDetail]`**: Vendor slug/identifier
- **`[activityId]`**: Activity ID

---

## 🧩 Common Tasks

### Adding a New Page

1. Create a new file in the appropriate route group:
   ```typescript
   // src/app/(public)/new-page/page.tsx
   export default function NewPage() {
     return <div>New Page</div>;
   }
   ```

2. The route will be available at `/new-page`

### Adding a New API Function

1. Create or update an API file (e.g., `lib/api.ts`):
   ```typescript
   const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
   
   export async function fetchData() {
     const response = await fetch(`${API_BASE_URL}/endpoint`);
     return response.json();
   }
   ```

2. Use it in your component:
   ```typescript
   import { fetchData } from "../lib/api";
   ```

### Adding a New Component

1. Create the component file:
   ```typescript
   // src/components/MyComponent.tsx
   export default function MyComponent() {
     return <div>Component</div>;
   }
   ```

2. Import and use it:
   ```typescript
   import MyComponent from "@/components/MyComponent";
   ```

### Styling with Tailwind

The project uses Tailwind CSS. Use utility classes:

```tsx
<div className="bg-blue-600 text-white p-4 rounded-lg">
  Styled content
</div>
```

### Using Icons

The project uses React Icons (Feather Icons):

```tsx
import { FiUser, FiCalendar } from "react-icons/fi";

<FiUser className="text-blue-500" />
```

---

## 🐛 Troubleshooting

### Port Already in Use

If port 3000 is already in use:

```bash
# Use the alternative port script
npm run start:user-frontend

# Or specify a custom port
npm run dev -- -p 3001
```

### Module Not Found Errors

1. Delete `node_modules` and `package-lock.json`
2. Run `npm install` again

### API Connection Issues

- Verify `.env.local` has correct `NEXT_PUBLIC_API_URL`
- Check that the backend API is running
- Check browser console for CORS errors
- Verify API endpoints match backend implementation

### Build Errors

1. Run `npm run lint` to check for linting errors
2. Ensure all TypeScript types are correct
3. Check for missing environment variables

### Image Loading Issues

- Verify `NEXT_PUBLIC_API_BASE_URL` is set correctly
- Check `next.config.ts` for image domain configurations
- Ensure image URLs from API are correct

### Date Picker Issues

- Verify `react-datepicker` CSS is imported: `import "react-datepicker/dist/react-datepicker.css"`
- Check date formatting matches API expectations

---

## 📝 Code Style & Best Practices

### TypeScript

- Use TypeScript for all new files
- Define interfaces for API responses
- Avoid `any` types when possible

### Component Organization

- Keep components focused and single-purpose
- Extract reusable logic into custom hooks
- Use props for component communication

### API Calls

- Always handle errors
- Use the `ApiResponse<T>` pattern for consistency
- Handle loading states appropriately

### State Management

- Use `useState` for local component state
- Use `useEffect` for side effects
- Clean up subscriptions and listeners

---

## 🔄 Next Steps

### Recommended Improvements

1. **Environment Variables**: Standardize API URL variable names
2. **Error Handling**: Implement global error boundary
3. **Loading States**: Consistent loading UI patterns
4. **Authentication**: Complete login/signup implementation
5. **Protected Routes**: Implement route protection
6. **API Client**: Create centralized API client with error handling
7. **Type Safety**: Define proper TypeScript interfaces for all API responses
8. **Testing**: Add unit and integration tests

---

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

---

## 🤝 Contributing

When contributing to this project:

1. Follow the existing code style
2. Write clear commit messages
3. Test your changes thoroughly
4. Update this guide if adding new features or patterns

---

## 📄 License

[Add license information here]

---

**Last Updated**: [Current Date]

For questions or issues, please contact the development team or open an issue in the repository.
