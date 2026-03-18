import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: "/admin",
  reactCompiler: true,
  transpilePackages: ["@pan/shared"],
};

export default nextConfig;
