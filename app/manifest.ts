import type { MetadataRoute } from "next";
import { SITE_NAME } from "@/app/site";
import { loadSiteMetadata } from "@/components/custom/landing/site-metadata";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  // The description is the home SDK's, from the site-metadata registry
  // base_sdk installs; with nothing registered the manifest carries none.
  // No colours are declared here: the theme tokens live in app/globals.css.
  const { description } = await loadSiteMetadata();
  return {
    name: SITE_NAME,
    short_name: SITE_NAME,
    ...(description ? { description } : {}),
    start_url: "/",
    display: "standalone",
  };
}
