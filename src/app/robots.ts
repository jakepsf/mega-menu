// src/app/robots.ts
import type { MetadataRoute } from "next";

// Ensure this matches your primary metadata domain!
const BASE_URL = "https://btoreno.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/"],
        disallow: [
          "/admin/",           // Blocks the admin login page
          "/admin/*",          // Securely blocks all dynamic dashboard/work manager sub-routes
          "/api/",             // Hides backend Next.js API handlers from scrapers
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}