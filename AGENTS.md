# Agent build brief — sticks-web

You are the first agent on this repository. It contains a brief and a
composable Next.js shell — nothing product-specific is built yet. Your job
is to turn the brief into a working application on that shell.

## What this is

**sticks-web** — The Sticks website: AI employees that ask first, with downloads of the Sticks app for Android and Windows.

Repo: `RokctAI/sticks-web` (public)
Accepted from: <https://github.com/RokctAI/factory/issues/55>

## Read first

1. [`docs/spec.md`](docs/spec.md) — the accepted brief, verbatim. It is the
   only statement of intent that exists. Where it is silent, decide, and
   record the decision in `.rokct/decision_log.md`.
2. [`README.md`](README.md) — what the shell already is, how it composes and
   builds, and the two manual steps every new shell needs (the registry
   template, the home SDK).
3. The open **Build v0** issue — your entry point.

## Protocol bootstrap

This repo ships the Rokct agent protocol as a bootstrap only. Run it once
before your first commit:

```bash
bash .rokct/bootstrap.sh
```

That fetches `initiate.py` from `RokctAI/The-Rokct-Protocol` and runs it,
installing skills, session workflows and `sync_workspace` into `.rokct/`.

Because this repo lives under `RokctAI`, `initiate.py` treats it as an org
repo: it installs the `.rok` skill and the Protocol workflows, and it writes
`.rokct/.workspace_config.json` itself, pointing `parent_repo` at
`RokctAI/occultation` — so working files (`memory.md`, `decision_log.md`,
`project_map.md`) sync to the org workspace. Nothing is pre-committed for it
to read. Run `bootstrap.sh` in a normal session, not under CI — `initiate.py`
skips installing the session workflows whenever `CI` is set.

## The shell and the SDK fleet

This is a thin Next.js shell on the Rokct SDK fleet: the host layer it
commits is what the SDK manifests name under `requires`, and everything
else is composed into it at build time from the SDKs listed in
`composer.json` — the SDK cache is committed under `.rokct/cache/` after a
`scripts/compose.sh refresh`, the composed output never is.

- **Build in the shell's terms.** A product feature is an SDK's Next.js half
  (`<sdk>/nextjs/` in its monorepo under `RokctAI`: `manifest.json`,
  `install.py`, `templates/`), composed through the registry template — not
  pages hand-written into this repo. The host layer here stays generic.
- **The backend is the single source of truth.** An SDK's `frappe/` defines
  the schema and the server-side rules; the `nextjs/` half mirrors it and
  calls only its own backend through `base_sdk`'s platform gateway.
- **Feature SDKs never import each other** (ADR-005). The only files one may
  import are the kernel's (`@/app/services/base/...`) and the host seams
  named in its manifest `requires`.
- **Composing an SDK is two edits, not one.** The registry template
  `core/utils/frappe/composer/sticks-web.json` in the Protocol repo is
  canonical; every compose re-materializes `composer.json` from it. Change
  the template first, mirror it here, then `scripts/compose.sh refresh`.
- **Exactly one home SDK.** Flag it `"home_sdk": true` in the template: it
  owns `app/page.tsx` and `base_sdk`'s single-answer landing registries.

Read these before writing any SDK-facing code. Do not work from the summary
above; it will drift, and these will not:

1. `SDK_ECOSYSTEM.md` at the root of `RokctAI/The-Rokct-Protocol` — the map,
   the manifest key tables, and the **SDK census**: the table fenced by
   `<!-- @generated-sdk-census-start -->` / `-end` is the authoritative answer
   to which SDKs exist and which repo each one lives in. Generated; never
   edit it by hand.
2. `SDK_CONSUMERS.md` beside it — for every SDK, its repo, its Next.js path,
   version and pin, and every shell that composes it. Also generated.
   `nextjs_compose_example.json` beside it is derived from it: the kernel
   this shell composes plus the menu of every other SDK with a Next.js half.
3. `core/utils/nextjs/README.md` in the same repo — the Next.js composer and
   installer contract (manifest keys, `requires`, integration markers).

This repo deliberately carries no `.relation` file. That marker belongs to
SDK repos only; an app shell declares what it consumes in `composer.json`.

## How to work

- Ship a v0 that a person can actually run: get the registry template into
  the Protocol, refresh, and make `bash scripts/compose.sh && npm run build`
  green on `main` — that is what Vercel deploys.
- Commit in small, reviewable steps against `main`.
- Keep `docs/spec.md` unedited — it is the accepted brief. New decisions go in
  `.rokct/decision_log.md`, new scope goes in new issues.
