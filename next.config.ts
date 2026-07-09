import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/api/export": ["./styles/**/*.css"],
  },
};

export default nextConfig;
