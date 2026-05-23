import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  webpack: (config) => {
    config.watchOptions = {
      ignored: ["**/node_modules/**", "**/.next/**", "**/data/**"],
      poll: false,
    };
    return config;
  },
};

export default nextConfig;
