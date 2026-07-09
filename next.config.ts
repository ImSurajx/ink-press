import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/api/export": ["./styles/**/*.css"],
  },
  serverExternalPackages: ["playwright-core", "@sparticuz/chromium-min"],
};

export default nextConfig;
