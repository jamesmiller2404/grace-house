import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(__filename);

const nextConfig: NextConfig = {
  reactCompiler: true,
  turbopack: {
    root: path.resolve(dirname),
  },
  images: {
  remotePatterns: [
    {
      protocol: "https",
      hostname: "payload-app-nxg2.onrender.com",
      pathname: "/api/media/file/**",
    },
    { protocol: "http", hostname: "localhost", pathname: "/api/media/file/**" },
  ],
  },
  };

export default withPayload(nextConfig, { devBundleServerPackages: false });

