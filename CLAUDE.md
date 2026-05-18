@AGENTS.md

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> Read `AGENTS.md` first (imported above) — this Next.js version (16.x) diverges from common training data. Consult `node_modules/next/dist/docs/` before assuming App Router APIs from memory.

## Architecture

A Next.js site listing AI tools, with a Supabase backend used for submission intake and on-demand revalidation. **Two build modes** coexist:

1. **Static export** (`npm run build:static`, sets `STATIC_EXPORT=true`) → `out/`, uploaded as a ZIP to EdgeOne Pages. **Primary production path.**
2. **Standard Next.js build** (`npm run build`) → `.next/`, with API routes live. Used for Vercel preview/staging.

`next.config.ts` toggles `output: 'export'` based on `process.env.STATIC_EXPORT`. Do not hard-code `output: 'export'` — that breaks the Vercel path because static export disallows the dynamic API routes under `src/app/api/`.

- **App Router** under `src/app/`. In static-export mode every dynamic segment route (`tools/[slug]`, `by/[slug]`, `list/[slug]`, `badge/[slug]`, `categories`, `industries`, `alternatives`, `compare`, etc.) must implement `generateStaticParams` — **missing `generateStaticParams` is the documented root cause of the 18 known 404s** (`/blog/*`, `/collections/*`, `/weekly/*`) listed in `deploy/DEPLOY_NOTES.md`.
- **API routes** in `src/app/api/` only run under `next dev` / `next start` / Vercel; they are NOT part of the exported `out/` bundle.
  - `api/revalidate/route.ts` — Supabase webhook target. Auth via `x-webhook-secret` header against `REVALIDATE_SECRET`. Calls `revalidateTag('tools' | 'submissions', { revalidatePage: true })` and `revalidatePath` for affected tool slugs (including the old slug on UPDATEs).
  - `api/submissions/route.ts` — public POST endpoint. Validates payload (tool_name, website_url, tagline ≤50 chars, contact_email, category_slugs from a hard-coded allow-list), de-dupes categories, then inserts via the service-role client. Handles Postgres error codes `23505` (duplicate) and `23514` (check constraint).
- **Two parallel data sources** — be deliberate about which one a page uses:
  - `src/lib/data.ts` — hard-coded `tools` / `categories` / `BlogPost` / `Sponsor` arrays. Most static pages read from here.
  - `src/lib/supabase-server.js` — `createServerClient()`, `toolsTable()`, `submissionsTable()` helpers using the service-role key. Server-only.
- **i18n**: `src/lib/i18n` exports a `ui` object consumed across the app. UI strings are Chinese; `layout.tsx` reads `ui.locale` for `<html lang>` and `openGraph.locale`.
- **Tailwind v4** (`@tailwindcss/postcss`). `src/app/layout.tsx` ships an inline `<style dangerouslySetInnerHTML>` block that hard-codes specific utility classes (`text-white`, `bg-zinc-900`, amber/emerald/rose ramps). This is a workaround for Tailwind v4's dedupe stripping classes that the static export wouldn't otherwise emit — don't remove it without verifying the dedupe behavior on the affected pages.
- **Badge generation** runs as `prebuild`: `tsconfig.script.json` compiles `scripts/generate-badges.ts` (+ its imports from `src/lib`) into `dist-scripts/` using `NodeNext` resolution, then the compiled JS writes per-tool SVGs into `public/badges/`. The script needs its own tsconfig because the runtime app uses `moduleResolution: bundler` while the Node script needs `NodeNext`.
- **Supabase schema** lives in `supabase/migrations/` (single migration, `20260514121933_create_detailed_schemas.sql`). Apply with the standard Supabase CLI workflow.

## Commands

```bash
npm run dev                       # next dev — exercises API routes locally
npm run build                     # prebuild (badges) → next build (.next/) — for Vercel / API routes
npm run build:static              # same, but STATIC_EXPORT=true so Next.js exports to out/ for EdgeOne
npm start                         # next start — serves a non-export build (rarely used here)

npx vitest                        # run all tests (config at vitest.config.ts, env: node)
npx vitest path/to/file.test.ts   # single test file
npx vitest -t "test name"         # single test by name
npx tsc --noEmit                  # standalone typecheck (build skips this)
```

Tests live under `back/test/test-day01/` (Supabase connectivity, RLS, schema, revalidate webhook, submissions API, Next data fetch). `back/test/test-day01/helpers/setup.ts` loads `.env.test` first, then falls back to `.env.local`. Supabase tests use `describe.skipIf(!hasSupabaseCreds)` — without the three env vars set they silently no-op rather than fail.

**Note:** `build` runs `next build --no-type-check`, so type errors won't fail CI/build. Run `npx tsc --noEmit` separately when you care about types.

## Deployment

- **EdgeOne Pages (primary)**: run `npm run build:static`, then upload the contents of `out/` as a ZIP. Full playbook in `deploy/DEPLOY_NOTES.md`. Critical gotcha: zip the **contents** of `out/`, not the `out/` directory itself (`cd out && zip -r ../out.zip .`), otherwise root-path requests 404. The audit helper `scripts/audit-static.mjs` consumes a saved `tmp-index.html` and HEAD-checks every linked asset.
- **Vercel (preview/staging)**: auto-deploys from Git. Uses default `npm run build` (no `STATIC_EXPORT`), so API routes ship as serverless functions. **No `vercel.json` is needed** — let Vercel auto-detect the Next.js framework. Required environment variables (set in Vercel Dashboard → Settings → Environment Variables): `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `REVALIDATE_SECRET`.

## Environment variables (`.env.local`, gitignored)

- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` — public, browser-safe.
- `SUPABASE_SERVICE_ROLE_KEY` — server-only; used by `supabase-server.js`.
- `REVALIDATE_SECRET` — shared secret with the Supabase webhook; required by `api/revalidate`.
