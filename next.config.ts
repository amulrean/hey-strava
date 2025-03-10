import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'dgalywyr863hv.cloudfront.net',  // Strava profile images (CDN)
      },
      {
        protocol: 'https',
        hostname: '*.cloudfront.net',  // Other Strava CDN domains
      },
      {
        protocol: 'https',
        hostname: '*.strava.com',  // Strava main domains
      },
    ],
  },
};

export default nextConfig;
