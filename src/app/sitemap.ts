// src/app/sitemap.ts
import type { MetadataRoute } from "next";

// Primary domain where your SEO authority lands
const BASE_URL = "https://btoreno.com";

// Tell Next.js to revalidate/regenerate the sitemap at most once every hour (3600 seconds)
export const revalidate = 3600; 

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // ── Pure Static Routes ──────────────────────────────────────────────────────
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/works`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];

  return staticRoutes;
}