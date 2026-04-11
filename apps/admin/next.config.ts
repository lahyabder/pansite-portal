import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: "/admin",
  reactCompiler: true,
  transpilePackages: ["@pan/shared"],
  experimental: {
    serverActions: {
      bodySizeLimit: '50mb'
    }
  }
};

export default nextConfig;
