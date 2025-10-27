import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
  //basePath: "/out"
  basePath: "/chat_sample_local_build",
  assetPrefix: "/chat_sample_local_build/"

};

export default nextConfig;
