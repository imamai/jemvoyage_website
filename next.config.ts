import type { NextConfig } from "next";

const supabaseHost = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : undefined;

const nextConfig: NextConfig = {
  images: {
    // AVIF first, WebP second, original as the floor.
    formats: ["image/avif", "image/webp"],
    // Matches the breakpoints the design system actually uses, so the
    // optimiser is not asked to generate widths nothing requests.
    deviceSizes: [400, 640, 828, 1080, 1280, 1600, 1920, 2560],
    imageSizes: [64, 96, 128, 256, 384],
    remotePatterns: [
      // Supabase Storage — where real Jemvoyage photography lands once
      // uploaded through the CMS.
      ...(supabaseHost
        ? [
            {
              protocol: "https" as const,
              hostname: supabaseHost,
              pathname: "/storage/v1/object/public/**",
            },
          ]
        : []),
      // Unsplash — development placeholders only. Every placeholder is a
      // jemvoyage_media row carrying credit, source_url and license; none is
      // referenced from a component. Removing this entry once real photography
      // is uploaded is a safe, expected cleanup.
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
};

export default nextConfig;
