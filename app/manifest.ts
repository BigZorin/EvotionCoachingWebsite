import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Evotion Coaching",
    short_name: "Evotion",
    description: "Personal Training & Online Coaching voor jouw droomlichaam",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0f172a",
    icons: [
      {
        src: "/images/evotion-favicon.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/images/evotion-favicon.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  }
}
