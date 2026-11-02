# sticks-web decision log

Decisions taken while building, where `docs/spec.md` (the accepted brief) is
silent. Newest first.

## 2026-11-01: the landing's home is agent_sdk, app_type `sticks`

- **Home SDK.** Ray ruled there is no new sticks SDK and the AI lives in
  agent_sdk, so agent_sdk is home through a new `app_type.sticks` block
  (agent_sdk 1.24.0). Its top level is rokct.ai's whole product (chat,
  register, opportunities; it needs `db/`, auth_sdk and a backend), so the
  block sets `"common": false` - a persona opt-out added to The-Rokct-Protocol's
  Next.js installer - and this shell composes only the Sticks landing.
- **No registry template.** The site has no backend and nothing to sign in
  to, so like southriver-web it composes from its own `composer.json`
  (kernel + agent_sdk). `.rokct/config/app_type` is `sticks`, the persona name.
- **No auth_sdk.** The brief: "There is no website to sign up on. Everything
  happens in the app." The header draws no Log in or Sign up.
- **Colour.** Black and white (Ray). `--primary` is black on light and
  white on dark; the landing's own tokens are scoped in agent_sdk.
- **Screens and downloads** are read from RokctAI/sticks on GitHub with an
  hour's revalidate: the guided tour's captures by step id (dark captures
  under `marketing/tour/screenshots-dark/` once the tour commits them), and
  the newest release's `app-vX.apk` and `sticks-windows-setup-vX.exe`.
  `SCREEN_RENDERS` in agent_sdk's `sticks-sources.ts` switches a screen to
  an SVG render when those are ready (Ray's choice).
- **Pinned to the agent_sdk PR head** until agent_sdk 1.24.0 and the
  Protocol installer change merge; then refresh against main.
