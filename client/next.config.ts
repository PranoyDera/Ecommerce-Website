import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingRoot: __dirname,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.dummyjson.com",
      },
      {
        protocol: "https",
        hostname: "i.dummyjson.com",
      },
       {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**", // allow all Cloudinary paths
      },
    ],
  },
};

export default nextConfig;
