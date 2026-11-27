/**
 * Single source of truth for this shell's public identity: the origin it is
 * served from and the name it calls itself.
 *
 * Both come from the deployment, never from code:
 *
 *   NEXT_PUBLIC_SITE_URL   the public origin (no trailing slash). Unset, the
 *                          shell falls back to STICKS_HOME_URL in production,
 *                          else to localhost - the same resolution base_sdk's
 *                          app/lib/site-metadata.ts applies to metadataBase,
 *                          so /robots.txt and /sitemap.xml agree with the
 *                          link-preview cards.
 *   NEXT_PUBLIC_SITE_NAME  the name the wordmark and the web app manifest
 *                          print. Unset, it is the app_type this repo was
 *                          spawned with (.rokct/config/app_type), which is
 *                          also the registry template's name.
 *
 * No product copy lives here: the <title>, description and preview cards are
 * the home SDK's, registered into base_sdk's site-metadata registry at
 * compose time (components/custom/landing/site-metadata.ts).
 */
/**
 * Where Sticks lives (Ray 2026-11-27). The production origin when
 * NEXT_PUBLIC_SITE_URL is unset; the platform (hub) sits behind it.
 * rokct.ai is the corporate site only, never the way into Sticks.
 */
export const STICKS_HOME_URL = "https://usesticks.com";
export const STICKS_PLATFORM_URL = "https://platform.usesticks.com";

function trimSlashes(value: string): string {
  return value.replace(/\/+$/, "");
}

function resolveSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (fromEnv) return trimSlashes(fromEnv);
  if (process.env.NODE_ENV === "production") return STICKS_HOME_URL;
  return "http://localhost:3000";
}

export const SITE_URL = resolveSiteUrl();

/** The app_type this shell was spawned with; the neutral fallback name. */
export const APP_TYPE = "sticks-web";

export const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME?.trim() || APP_TYPE;
