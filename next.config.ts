import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import config from "@/config";

// Intentionally reference the config to make sure it's loaded and validated
// eslint-disable-next-line @typescript-eslint/no-unused-expressions
config;

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  /* config options here */
};

export default withNextIntl(nextConfig);
