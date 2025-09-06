import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "picsum.photos",
      "lh3.googleusercontent.com",
      "liniaksara.com",
      "liniaksara.id",
      "liniaksara.org",
      "fastly.picsum.photos",
      "f2a947fd743a.ngrok-free.app",
      "unpkg.com",
    ],
  },
  allowedDevOrigins: [
    "localhost:3000",
    "98e51a95d389.ngrok-free.app",
  ],
  webpack: (config, { isServer }) => {
    // Canvas handling
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        canvas: false,
      };
    }

    return config;
  },
};

export default nextConfig;
