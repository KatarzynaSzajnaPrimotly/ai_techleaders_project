import path from "node:path";
import type { NextConfig } from "next";
import { parseEnv } from "@devmentor/core/config";

// Validate the two-signal local mock-auth gate before Next serves or builds the app.
parseEnv();

const nextConfig: NextConfig = {
  transpilePackages: ["@devmentor/ui", "@devmentor/core", "@devmentor/db"],
  serverExternalPackages: ["@mikro-orm/core", "@mikro-orm/postgresql", "@mikro-orm/sql", "pg"],
  turbopack: { root: path.join(__dirname, "../..") },
  async headers() {
    return ["/register/confirm", "/sign-in", "/home", "/mentor", "/admin/:path*"].map((source) => ({
      source,
      headers: [
        { key: "Referrer-Policy", value: "no-referrer" },
        { key: "Cache-Control", value: "no-store" },
      ],
    }));
  },
};

export default nextConfig;
