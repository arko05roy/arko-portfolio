import type { MetadataRoute } from "next";

const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://arkoroy.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: base, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/projects`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/resume`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/uses`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/support`, lastModified: now, changeFrequency: "yearly", priority: 0.4 },
  ];
}
