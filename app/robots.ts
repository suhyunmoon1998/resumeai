import type { MetadataRoute } from "next";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://voiceresume-zeta.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Keep private/app-only surfaces out of search results;
        // public share cards (/card/[slug]) stay crawlable.
        disallow: ["/api/", "/auth/", "/dashboard", "/interview"],
      },
    ],
    sitemap: `${APP_URL}/sitemap.xml`,
  };
}
