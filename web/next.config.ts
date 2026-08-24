import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
