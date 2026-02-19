import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin/", "/_next/", "/actions/", "/bedankt/", "/presentatie/", "/martin-socials/"],
      },
    ],
    sitemap: "https://evotion-coaching.nl/sitemap.xml",
    host: "https://evotion-coaching.nl",
  }
}
