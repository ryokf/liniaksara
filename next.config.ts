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
      "ktmvcsnuvbvqytahrcli.supabase.co"
    ],
  },
  allowedDevOrigins: [
    "localhost:3000",
    "98e51a95d389.ngrok-free.app",
    "722a2a26a666.ngrok-free.app",
  ],
  transpilePackages: ['react-pdf', 'pdfjs-dist'],
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        canvas: false,
        encoding: false
      };
      config.resolve.fallback = {
        ...config.resolve.fallback,
        canvas: false,
        encoding: false
      };
    }
    return config;

    return config;
  },
};

export default nextConfig;
