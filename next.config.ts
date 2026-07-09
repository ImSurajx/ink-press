import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    outputFileTracingIncludes: {
      "/api/export": ["./styles/**/*.css"],
    },
  },
};

export default nextConfig;
