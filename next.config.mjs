/** @type {import('next').NextConfig} */
const nextConfig = {
  // Compose-time configuration for the SDKs this shell composes.
  //
  // `env` entries are inlined into the bundle at build time, which is what
  // makes this file the right place for a switch that is a PROPERTY OF THIS
  // SHELL rather than of a deployment: it is committed, it needs nothing set
  // in the Vercel project, and it cannot drift between environments.
  //
  // It is also the only durable place for one. An SDK-installed file is
  // rewritten by every compose - `scripts/compose.sh`
  // reconcile_tracked_host_files() spells out that even for a path this repo
  // tracks, "compose installs the SDK copy over it at build time" - and
  // composer.json is re-materialised from the registry template. next.config.mjs
  // is host-owned and installed by nobody, so it survives.
  env: {
    // Seam for auth_sdk >= 1.6.0, left unset until auth_sdk is composed.
    //
    // ROKCT_TENANT_LINK picks which tenant link auth_sdk's credentials flow
    // uses. Unset (the default) means "database": login looks the user's
    // tenant site up in the local Postgres store auth_sdk installs, and
    // register writes a row there - a MULTI-TENANCY feature for a deployment
    // that serves many tenant backends (RokctAI/rokctai_frontend is one).
    // A shell that serves exactly ONE backend, known from ROKCT_BASE_URL /
    // NEXT_PUBLIC_ROKCT_BASE_URL, has nothing for a database to tell it:
    // "single-tenant" selects app/(auth)/tenant-link-single.ts, which imports
    // neither @/db nor drizzle nor postgres, so login and register open no
    // database connection and POSTGRES_URL is not a variable the project
    // needs. Uncomment when auth_sdk joins this shell's composition:
    //
    // ROKCT_TENANT_LINK: "single-tenant",
  },
};

export default nextConfig;
