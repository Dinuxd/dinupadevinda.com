import type { MetadataRoute } from "next";
import { siteUrl } from "@/content/profile";

export const dynamic = "force-static";

const routes = ["/", "/about/", "/experience/", "/projects/", "/certifications/", "/contact/"];
const lastModified = new Date("2026-07-08");

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified
  }));
}
