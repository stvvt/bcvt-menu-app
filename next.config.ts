import type { NextConfig } from "next";
import config from "@/config";

// Intentionally reference the config to make sure it's loaded and validated
// eslint-disable-next-line @typescript-eslint/no-unused-expressions
config;

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
