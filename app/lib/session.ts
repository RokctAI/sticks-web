import "server-only";

/**
 * Host-owned session seam - the NEUTRAL copy.
 *
 * Named in base_sdk's manifest `requires`: the kernel's session reader
 * (app/services/base/session.ts, which platform-gateway.ts's paasCall /
 * platformCall go through) and this shell's app/lib/client.ts import ONLY
 * this module, never "@/app/(auth)/..." directly. With no auth surface
 * composed there are no sessions, so both functions resolve to null and
 * every gated surface base_sdk installs (/admin, /manager) reads as
 * signed-out.
 *
 * Composing auth_sdk overwrites this file with its NextAuth-backed
 * implementation (same two exports) at compose time; scripts/compose.sh
 * refresh restores this host copy afterwards and records it, so the tree
 * keeps the neutral seam and the build gets the SDK's.
 */

/** The current session, or null: nothing is signed in on the bare shell. */
export async function auth(): Promise<any> {
  return null;
}

/** Alias kept for call sites that read as "session" rather than "auth". */
export async function getCurrentSession(): Promise<any> {
  return null;
}
