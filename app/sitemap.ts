import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: site.url , changeFrequency: "monthly", priority: 1 },
    { url: `${site.url}/about`, lastModified, changeFrequency: "monthly", priority: 0.9 },
    { url: `${site.url}/services`, lastModified, changeFrequency: "monthly", priority: 0.85 },
    { url: `${site.url}/projects`, lastModified, changeFrequency: "weekly", priority: 0.9 },
    { url: `${site.url}/projects/wazobia`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${site.url}/privacy`, lastModified, changeFrequency: "yearly", priority: 0.2 },
  ];
}
