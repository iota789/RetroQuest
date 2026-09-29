<!--
Sync Impact Report
- Version change: (unratified template) → 1.0.0
- Rationale: Initial ratification. The prior file was the unfilled scaffold (all
  placeholders present, no project-specific content) — this is not an amendment,
  it is the first real constitution for this project.
- Modified principles: n/a (first ratification)
- Added sections:
  - Core Principles: I. Single-Owner Product Scope, II. Game Catalog Data Integrity,
    III. Sanitized Asset Filenames, IV. Reuse Before Introducing, V. No Hardcoded Secrets
  - Technology & Hosting Constraints (SECTION_2)
  - Development Workflow (SECTION_3)
  - Governance
- Removed sections: none
- Deferred / TODO placeholders: none — all template tokens resolved from repo state
  (package.json, nuxt.config.ts, app/assets/data/*.json, server/api/admin/*, and the
  approved single-user auth/progress plan discussed with the owner).
- Templates requiring follow-up: none tracked in this repo (no .specify/templates
  consumers beyond the constitution itself were found to reference principle count/names).
-->

# RetroQuest Constitution

## Core Principles

### I. Single-Owner Product Scope
RetroQuest serves exactly one operator — the site owner. Every feature (authentication,
progress tracking, playlists, admin tooling) MUST assume a single account and MUST NOT
introduce signup flows, multi-tenant data models, per-user scoping, or role systems beyond
"owner" unless the owner explicitly asks for it. Where a single login can reasonably cover
both playing games and managing the catalog (admin actions), it MUST — do not maintain two
parallel auth mechanisms for one person.
Rationale: this was an explicit, deliberate product decision (moving away from multi-user
login to a personal, single-user site with tracked progress). Building for hypothetical
future multi-user support adds cost and complexity nobody has asked for.

### II. Game Catalog Data Integrity
`app/assets/data/games.json` and `app/assets/data/platforms.json` are the source of truth
for the catalog and MUST remain valid, parseable JSON at all times. Every game entry MUST:
- use a globally unique `_id`;
- set `platform` to a value that exists in `platforms.json` AND matches a supported
  EmulatorJS core identifier exactly (e.g. `nes`, `gb`, `gba`, `segaMD`, `snes`, `n64`);
- reference a `path` that resolves to a real file under `public/roms/<platform>/`;
- include every field present on existing entries (`name`, `cover_url`, `platform_name`,
  `year`, `date_of_release`, `developer`, `genre[]`, `summary`, `trivia`, `movement[]`).
Any edit to these files MUST be validated by parsing it (e.g. `node -e "require(...)"`)
and confirming referenced asset paths exist before the change is considered done.
Rationale: nothing validates this file at build time — a malformed entry, a platform typo,
or a dangling path silently breaks a game page or the emulator at runtime with no error
surfaced anywhere else in the stack.

### III. Sanitized Asset Filenames
ROM and cover-image filenames stored under `public/` MUST be sanitized to
`[a-zA-Z0-9._-]` before being referenced from `games.json` — matching the
`sanitizeFilename` behavior already enforced in `server/api/admin/add-game.post.ts`.
Assets added by hand (outside the admin upload flow) MUST follow the same convention as
admin-uploaded ones, not the raw filename they arrived with.
Rationale: unsanitized filenames (spaces, parentheses, brackets, commas) risk breaking the
emulator's iframe `srcdoc` string interpolation and URL resolution, and are inconsistent
with how most of the existing catalog is named.

### IV. Reuse Before Introducing
New functionality MUST first reuse existing composables, components, dependencies, and
conventions already present in the project (e.g. `usePublicUrl`, PrimeVue components,
Tailwind utility classes, the admin upload's field/sanitization helpers) before adding a
new library or hand-rolled equivalent. A new dependency, ORM, hosting provider, or auth
mechanism MUST be justified by a concrete capability the current stack cannot reasonably
provide, and MUST replace/consolidate the thing it supersedes rather than living alongside
it indefinitely (e.g. one session-based login replacing the old admin-key gate, not both).
Rationale: this is a small, single-owner app — every added abstraction, dependency, or
parallel mechanism is a maintenance cost paid by one person with no team to share it.

### V. No Hardcoded Secrets
Secrets — admin/owner credentials, session-signing keys, database connection strings —
MUST be read from environment variables with no committed fallback value. A hardcoded
fallback secret found anywhere in the codebase (e.g. `runtimeConfig` defaults in
`nuxt.config.ts`) MUST be treated as a defect to fix opportunistically, never as a pattern
to copy into new code.
Rationale: `nuxt.config.ts` currently ships a hardcoded fallback admin key committed to
source control — a known, real issue. This principle stops it from spreading further while
the fix is pending.

## Technology & Hosting Constraints

RetroQuest is a Nuxt 4 (Vue 3) app using file-based routing (`app/pages/**`) and Nitro
server routes (`server/api/**`). UI is built on Tailwind (`@nuxtjs/tailwindcss`) and
PrimeVue (Aura theme) with Phosphor icons — new UI work MUST use these rather than adding a
competing component or styling library. Emulation runs entirely client-side via EmulatorJS
inside a sandboxed iframe (`app/components/emulator.vue`); there is no server-side emulation
and none should be introduced.

The project defaults to the simplest hosting model that satisfies the feature at hand. As
shipped, the site is a fully static export (`nitro.preset` / GitHub Pages) with no live
backend in production. Where a feature genuinely requires server-side persistence (for
example: single-owner login, play-progress and playtime tracking, an ordered playlist),
the approved path is Vercel hosting + a small Postgres database (Drizzle ORM,
`@neondatabase/serverless`) + `nuxt-auth-utils` for session auth — chosen specifically to
avoid native-binary ORM issues on serverless and to avoid building bespoke auth. Any further
change to hosting provider, database, or auth mechanism MUST be an explicit, discussed
decision, not a side effect of an unrelated change, and MUST update `nuxt.config.ts` and the
deployment workflow together — a half-migrated state (e.g. static-export config left in
place after adding a database) is not acceptable.

## Development Workflow

There is no automated test suite or linter configured in this project (`package.json` has
no test/lint scripts). Given that, every change MUST be manually verified before being
considered complete:
- UI/behavior changes: run `npm run dev` and exercise the affected page or flow directly.
- Data changes (`games.json`, `platforms.json`): parse the file to confirm valid JSON and
  confirm every new/changed `path` and `cover_url` resolves to a real file on disk.
- Auth or admin changes: verify both the regular game-browsing flow and the admin
  (`/admin/**`) flow, since they are intended to share one login rather than diverge.
Changes MUST NOT be reported as done on the strength of type-checking or "it should work"
reasoning alone when the affected surface is directly runnable.

## Governance

This constitution supersedes ad-hoc convention for anything it explicitly covers. Because
this is a single-owner project, amendments are proposed and adopted directly by the owner —
no separate review board — but every amendment MUST still:
1. Update the version number per semantic versioning (MAJOR: backward-incompatible removal
   or redefinition of a principle; MINOR: a new principle or materially expanded guidance;
   PATCH: wording/clarification with no rule change);
2. Update `Last Amended` below to the date of the change;
3. Prepend a Sync Impact Report (as the HTML comment at the top of this file) describing
   what changed and why.
Any plan or implementation that knowingly conflicts with a principle here MUST say so
explicitly and state the reason, rather than silently deviating.

**Version**: 1.0.0 | **Ratified**: 2026-09-29 | **Last Amended**: 2026-09-29
