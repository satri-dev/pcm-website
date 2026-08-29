import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  cacheLife: {
    // rarely — nav, footer, site settings (long stale/revalidate/expire)
    rarely: {
      stale: 60 * 60, // 1 hour client-side without revalidation
      revalidate: 60 * 60 * 12, // refresh in background at most every 12h
      expire: 60 * 60 * 24 * 7, // expire completely after a week idle
    },
    // content — page bodies like About, Admissions, Programs
    content: {
      stale: 60 * 5, // 5 minutes
      revalidate: 60 * 15, // 15 minutes
      expire: 60 * 60 * 24, // 1 day
    },
    // frequent — announcements, event listings, close-to-real-time content
    frequent: {
      stale: 60, // 1 minute
      revalidate: 60 * 5, // 5 minutes
      expire: 60 * 60, // 1 hour
    },
  },
  images: {
    // Allow Next.js Image to optimise images served from our local
    // /assets/[...path] route handler (which streams files from ../assets/)
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: "https",
        hostname: "api.qrserver.com",
        pathname: "/v1/create-qr-code/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "http",
        hostname: "localhost",
        pathname: "/assets/**",
      },
      {
        // Production — same-origin relative paths work via localPatterns
        protocol: "https",
        hostname: "**",
        pathname: "/assets/**",
      },
    ],
    localPatterns: [
      {
        // Allows next/image to serve /assets/** from the same origin
        pathname: "/assets/**",
      },
      {
        // Public images used across the app (hero slides, news, programs, logo)
        pathname: "/images/**",
      },
      {
        // Root-level logo used by auth pages
        pathname: "/logo-pcm.png",
      },
    ],
  },
};

export default nextConfig;
