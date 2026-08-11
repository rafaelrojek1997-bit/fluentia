import type { NextConfig } from "next";

const mobileBuild = process.env.CAPACITOR_BUILD === "true";

const nextConfig: NextConfig = {
  ...(mobileBuild ? { output: "export" as const, trailingSlash: true, images: { unoptimized: true } } : {}),
  reactStrictMode: true,
  poweredByHeader: false,
  experimental: { optimizePackageImports: ["lucide-react", "framer-motion"] },
  async headers() {
    return [{
      source: "/(.*)",
      headers: [
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "X-Frame-Options", value: "DENY" },
        { key: "Permissions-Policy", value: "camera=(), geolocation=(), microphone=(self)" }
      ]
    }];
  }
};

export default nextConfig;
