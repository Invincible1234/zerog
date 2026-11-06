import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  distDir: process.env.ZEROG_DIST_DIR || ".next",
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  output: "standalone",
  outputFileTracingIncludes: { "/*": ["./data/**/*"] },
};
export default nextConfig;
