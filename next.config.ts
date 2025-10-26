import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
  basePath: "/chat_sample_local_build",
  //basePath: "/out"
};

export default nextConfig;
