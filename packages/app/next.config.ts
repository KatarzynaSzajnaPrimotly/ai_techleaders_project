import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@devmentor/ui", "@devmentor/core", "@devmentor/db"],
  serverExternalPackages: ["@mikro-orm/core", "@mikro-orm/postgresql", "@mikro-orm/sql", "pg"],
  turbopack: { root: path.join(__dirname, "../..") },
};

export default nextConfig;
