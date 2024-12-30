import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'assets.aceternity.com',
      },
      {
        protocol: 'https',
        hostname: 'images.raidboxes.io',
      },
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
      },
      {
        protocol: 'https',
        hostname: 'outvio.com',
      },
      {
        protocol: 'https',
        hostname: 'multilingualpress.org',
      },
      {
        protocol: 'https',
        hostname: 'avada.io',
      },
      {
        protocol: 'https',
        hostname: 'static1.pocketnowimages.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  }
  
};

export default nextConfig;
