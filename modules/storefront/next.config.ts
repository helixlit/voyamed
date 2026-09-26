import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // The local preview is opened on 127.0.0.1 by the desktop app.
  // Without this, Next blocks browser assets and the interactive globe never mounts.
  allowedDevOrigins: ["127.0.0.1"],
};

export default nextConfig;
