import type { NextConfig } from "next";
import withPWA from "next-pwa";
import path from "path";

const config: NextConfig = {
  serverExternalPackages: ["mongoose"],
  turbopack: {
    root: path.resolve(__dirname),
  },
};

const nextConfig = process.env.NODE_ENV === "production"
  ? withPWA({
      dest: "public",
      register: true,
      skipWaiting: true,
    })(config)
  : config;

export default nextConfig;
