"use client";

/**
 * Host-owned session provider - the NEUTRAL copy.
 *
 * Named in base_sdk's manifest `requires`: its app-sidebar.tsx and
 * nav/team-switcher.tsx read `useSession()` from next-auth/react, which only
 * works under the provider this file mounts, so a shell composing base_sdk
 * WITHOUT auth_sdk must still mount one or /manager 500s (the manifest's
 * note on this path). Mounting NextAuth's provider with `session={null}`
 * gives those readers a settled "unauthenticated" status and makes no
 * request to /api/auth/session - a route that only exists once auth_sdk is
 * composed.
 *
 * Composing auth_sdk overwrites this file with its own provider (same
 * export) at compose time; scripts/compose.sh refresh restores this host
 * copy afterwards and records it, so the tree keeps the neutral seam and
 * the build gets the SDK's.
 */
import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";

export function SessionProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextAuthSessionProvider session={null}>{children}</NextAuthSessionProvider>
  );
}
