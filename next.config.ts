import type { NextConfig } from "next";

// next.config.js
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
        pathname: "/uploads/**",
      },
      // Add your production domain(s)
      {
        protocol: "https",
        hostname: "your-production-domain.com",
        pathname: "/uploads/**",
      },
    ],
  },
};
export default nextConfig;
