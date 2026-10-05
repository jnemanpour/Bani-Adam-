import type { NextConfig } from "next";

// PREVIEW_EXPORT=1 builds a static, no-backend preview for GitHub Pages (see scripts/build-preview.sh).
const preview = process.env.PREVIEW_EXPORT === "1";
const basePath = preview ? "/Bani-Adam-" : "";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  ...(preview && {
    output: "export",
    basePath,
    images: { unoptimized: true },
    trailingSlash: true,
  }),
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
    NEXT_PUBLIC_PREVIEW: preview ? "1" : "",
  },
};

export default nextConfig;
