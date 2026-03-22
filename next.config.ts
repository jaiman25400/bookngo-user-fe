import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "your-production-domain.com",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "bookngo-backend-pqx1.onrender.com",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "bookngo-backend.vercel.app",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "bookngo-backend-2u02cr7zi-jaiman25400s-projects.vercel.app",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.wallpapersden.com",
        pathname: "/image/**",
      },
    ],
  },
};
export default nextConfig;
