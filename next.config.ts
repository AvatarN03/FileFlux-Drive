import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/dashboard/storage", destination: "/storage", permanent: false },
      { source: "/dashboard/activity", destination: "/activity", permanent: false },
      { source: "/dashboard/settings", destination: "/settings", permanent: false },
      { source: "/dashboard/profile", destination: "/profile", permanent: false },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**",
      }
    ],
  },
};

export default nextConfig;
