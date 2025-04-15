import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['192.168.1.5', 'your-production-url.com'], // Replace with your actual IP + port
  reactStrictMode: true,
};

export default nextConfig;
