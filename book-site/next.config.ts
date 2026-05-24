import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.watchOptions = {
      ignored: ["**/node_modules/**", "**/.next/**", "**/data/**"],
      poll: false,
    };
    return config;
  },
};

export default nextConfig;
