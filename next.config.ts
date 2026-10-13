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
      hostname: "mockup1.offworldcreations.com",
      // hostname: "payload-app-nxg2.onrender.com",
      pathname: "/api/media/file/**",
    },
    { protocol: "http", hostname: "localhost", pathname: "/api/media/file/**" },
  ],
  // Local dev serves media from this same app (http://localhost:3000/api/media/file/...),
  // which Next 16+ blocks as a "private IP". Allow it — expected, not SSRF.
  dangerouslyAllowLocalIP: true,
  },
  };

export default withPayload(nextConfig, { devBundleServerPackages: false });

