# sticks-web

The Sticks website: AI employees that ask first, with downloads of the Sticks app for Android and Windows.

Spawned by [RokctAI Factory](https://github.com/rokctai/factory) from <https://github.com/RokctAI/factory/issues/55>.

## Status

**A composable Next.js shell — nothing product-specific is built yet.** The
brief lives in [docs/spec.md](docs/spec.md); the build instructions for the
agent live in [AGENTS.md](AGENTS.md).

The shell is the host layer a Rokct Next.js composition needs and nothing
more: the shadcn primitives (`components/ui/*`), `lib/utils.ts`,
`app/config/*`, `app/lib/*`, the neutral `branding` / `brand-logo` /
`theme-toggle` seams, the neutral `app/lib/session.ts` and
`components/custom/session-provider.tsx` (no auth surface composed yet), the
theme tokens in `app/globals.css`, and `app/site.ts`, the single source of
the public origin and name (`NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_SITE_NAME`;
the name falls back to the app_type). No product copy, colour or imagery
lives here: everything a visitor reads is the home SDK's, registered into
`base_sdk`'s landing registries at compose time. Each host seam file says in
its header which SDK `requires` it and which SDK installs over it.

`composer.json` is real from day one: the spawn wrote it from the protocol's
main — the registry template for this app_type when one existed, else the
SDK consumers index when it listed this shell, else the protocol's generic
`nextjs_compose_example.json` (the kernel: `telemetry_sdk` + `base_sdk`) —
and re-pinned every entry to the SHA-256 of that SDK's `install.py` at the
moment of the spawn.

Composing adds `/landing` (the landing host) and the `/admin` and `/manager`
trees `base_sdk` owns, plus whatever the other composed SDKs install. Nothing
composed is committed: every path an installer writes is listed in the
generated block at the end of [`.gitignore`](.gitignore) (empty until the
first refresh).

## Getting started

```bash
bash .rokct/bootstrap.sh   # installs the Rokct agent protocol into this repo
npm ci
bash scripts/compose.sh    # offline: composes from the committed .rokct/cache/
npm run build
```

The first compose of a fresh shell needs the cache the offline mode reads
from, and that comes from one refresh (a maintainer, or Actions with
`MONOREPO_PAT`):

```bash
bash scripts/compose.sh refresh   # vendors the composer + every SDK into .rokct/cache/, writes .rokct/lock.json
git add -A && git commit -m "chore: vendor the SDK cache"
bash scripts/compose.sh && npm run build
```

`refresh` composes from the registry template named by
`.rokct/config/app_type` (`sticks-web`, the slug of the name given in the
factory issue form) when `RokctAI/The-Rokct-Protocol` has one
(`core/utils/nextjs/composer/sticks-web.json`, else the frappe one). When
it has none, the refresh logs one `[i]` line and composes from this shell's
own committed `composer.json` (its `sdks[]`, `home_sdk` and `data` mode): a
client website needs no protocol template. Start `composer.json` from the
protocol's `nextjs_compose_example.json` (its `sdks[]` is the kernel this
shell already composes; `_available_sdks` is the menu of every other SDK with
a Next.js half, with repo, path, version and pin per the consumers index).

One manual step remains for every new shell: the home SDK. Flag exactly one
non-kernel entry `"home_sdk": true` — it owns `app/page.tsx` and
`base_sdk`'s single-answer landing registries. The spawn cannot pick it. A
client website with no backend sets `"data": "local"` and makes
`corporate_sdk` its home: the site is then its `data/` folder and its art in
`public/`, with no SDK of its own (corporate's
`nextjs/docs/local-sites.md`).

Once base_sdk 1.35.0 is composed, add `data/` per the base docs.

Other commands: `npm run dev` (http://localhost:3000), `npm start`,
`npm run typecheck`.

## Stack

Next.js 16 (App Router) + React 19 + TypeScript, on the versions and config
style [`RokctAI/rokctai_frontend`](https://github.com/RokctAI/rokctai_frontend)
and the other Next.js shells use, so the shells stay on one set of
conventions. The `@/*` → `./*` tsconfig path alias is the one the Next.js
SDK installer convention assumes.

**Tailwind is wired the way the other shells wire it**: Tailwind v3,
`darkMode: ["class"]` (driven by `base_sdk`'s composed `ThemeProvider`, dark
by default, light through the header toggle) and the shadcn HSL token set
`components/ui/*` reads through `hsl(var(--token))`. The content globs cover
every directory an SDK installer writes into (`app/`, `components/`, `lib/`,
`hooks/`). `--primary` in `app/globals.css` is the platform's placeholder
accent until this product has a look of its own; it is the one place the
accent, the primitives and `base_sdk`'s generated favicon letter take their
colour from.

`.npmrc` sets `legacy-peer-deps=true`: `react-day-picker@8` declares a
`date-fns` peer of `^2 || ^3` while `base_sdk`'s manifest declares
`date-fns@^4`; the pair works, npm's strict peer resolver refuses the tree.

## Configuration

Copy [`.env.example`](.env.example) to `.env.local`. Every variable this
shell reads is documented there; none is required to build.

## Composition and deployment

`scripts/compose.sh` has two modes:

| mode | who runs it | what it does |
| --- | --- | --- |
| `bash scripts/compose.sh` | Vercel, CI, developers | Verifies the vendored composer and every cache entry against `.rokct/lock.json`, then runs each cached SDK's `install.py`. Offline: no git, no network, no token. |
| `bash scripts/compose.sh refresh` | a maintainer, or Actions with `MONOREPO_PAT` | Re-fetches the protocol composer and every SDK the registry template names, replaces `.rokct/cache/` wholesale, rewrites `.rokct/lock.json`, the composed-output block in `.gitignore` and `package-lock.json`, and stages the cache. Commit the result to `main`. |

`vercel.json`'s `buildCommand` is `bash scripts/compose.sh && npm run build`
with deployments enabled for `main` only; the committed cache is what Vercel
composes from, with no token and no network. CI
(`.github/workflows/build.yml`) runs exactly those two commands and fails if
a compose changes anything committed (zero-drift), beside the fleet's
shared pipeline.
