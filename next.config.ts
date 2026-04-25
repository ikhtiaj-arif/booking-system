import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enables server-side features needed for Prisma on Vercel
  serverExternalPackages: ["@prisma/client", "prisma"],
};

export default nextConfig;
