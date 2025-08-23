import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin/", "/_next/", "/private/", "*.json$", "/actions/"],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/api/", "/admin/", "/actions/"],
      },
    ],
    sitemap: "https://evotion-coaching.nl/sitemap.xml",
    host: "https://evotion-coaching.nl",
  }
}
