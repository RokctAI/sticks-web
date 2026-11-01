# sticks-web — accepted brief

> Copied verbatim from https://github.com/RokctAI/factory/issues/55 at spawn time. Do not edit: this is the
> record of what was accepted. Decisions taken while building belong in
> `.rokct/decision_log.md`.

**One line:** The Sticks website: AI employees that ask first, with downloads of the Sticks app for Android and Windows.

## Rationale

Sticks is an app-only service: people use it in the Sticks app (RokctAI/sticks), not on the web. This site's single job is to explain Sticks and get the visitor to install the app.

- **Look and copy:** the approved concept is the source of truth: https://claude.ai/artifact/PDm9514Z16ypx8dk3oQQtq. It has the crowd hero, the "Meet your Sticks" roles with the Hire screen and the New hire card, the live feed demo, an ask example, Between Sticks, how it works, and the final call to action. Fonts are Montserrat and Nunito, and icons are Remixicon only.
- **Phone screens:** they come from the app's own guided tour so they are always the latest: `https://raw.githubusercontent.com/RokctAI/sticks/main/marketing/tour/screenshots/<NN-step_id>.png`. Match screens by step id, not by number.
- **Downloads:** read the newest RokctAI/sticks release from the GitHub API and link its release APK (`app-vX.apk`, never the debug APK) and its Windows installer directly. The Windows installer is being added to the app's release build.
- **Footer:** `© 2026 Sticks · Built with ♥ by ROKCT`, with the heart labelled "love" for screen readers.
- **Rules:** no client showcase, and the colour must be clearly different from our other sites (fleet colour rule).
- **Done means:** the site is live on Vercel, matches the concept at 1440 and 390 in light and dark, has no console errors, its download buttons reach the current release files, and it is added to the studio portfolio.
