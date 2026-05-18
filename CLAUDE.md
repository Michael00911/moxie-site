# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Critical: Next.js version warning

This project uses **Next.js 16.2.5** with **React 19.2.4** — versions that may differ significantly from your training data. Before writing any Next.js-specific code, read the relevant guide in `node_modules/next/dist/docs/`. Heed deprecation notices.

## Commands

```bash
npm run dev      # Start dev server at http://localhost:3000
npm run build    # Production build
npm run start    # Start production server
```

There is no lint or test script configured. TypeScript is checked implicitly during build (`tsc --noEmit` via `next build`).

## Architecture

**Moxie** is a static Chinese-language AI tool directory ("子墨说AI"). All content is hardcoded in TypeScript — there is no database or backend API.

### Data layer (`src/lib/`)

All site data lives here as exported TypeScript arrays and helper functions:

- **`data.ts`** — primary data file: `tools[]`, `categories[]`, `sponsors[]`, `newsItems[]`, `blogPosts[]`, `collections[]`, `monthlyTop10[]`, `recentLaunches[]`, `weeklyReviews[]`, `weeklyIssues[]`. Adding a new tool = adding an object to `tools[]`.
- **`types.ts`** — core types: `Tool`, `Category`, `ToolLevel` (`L1`–`L4`). L1 = "子墨亲测" (personally tested), L2 = tried, L3 = curated, L4 = pending.
- **`compare.ts`** — structured head-to-head comparisons (`Compare[]`), each with dimensions, scenarios, verdict, FAQ.
- **`alternatives.ts`** — alternative tool lists per tool.
- **`industries.ts`** — industry-specific pages (`Industry[]`): ecom, saas, content-creator, restaurant, education, service.
- **`lists.ts`**, **`marketplace.ts`**, **`launches.ts`**, **`purposes.ts`**, **`use-cases.ts`**, **`intersections.ts`**, **`free-tools.ts`**, **`business.ts`**, **`feed.ts`** — additional content datasets.
- **`i18n/zh.ts`** — all UI strings centralized in a typed dictionary. Import via `import { ui } from "@/lib/i18n"`. Adding an English locale = create `en.ts` implementing `Dict`, then update `i18n/index.ts`.

### Pages (`src/app/`)

App Router structure. Key route patterns:
- `/tools/[slug]` — individual tool detail pages
- `/compare/[slug]` — head-to-head tool comparisons
- `/alternatives/[slug]` — alternative tool listings
- `/industries/[slug]` — industry landing pages
- `/industries/[slug]/[purpose]` — industry × purpose cross pages
- `/badge/[slug]/route.ts` — API route generating tool badge images
- `/free/*` — free utility tools (token calculator, LLM pricing compare, etc.)

### Components (`src/components/`)

Shared UI: `tool-card.tsx`, `launch-card.tsx`, `search-hero.tsx`, `activity-feed.tsx`, `news-list.tsx`, `sponsored-banner.tsx`, `tab-switch.tsx`, `floating-cta.tsx`.

### Styling

Tailwind CSS v4 (via `@tailwindcss/postcss`). The root layout (`src/app/layout.tsx`) contains inline `!important` overrides for specific Tailwind utility classes — this is a deliberate workaround for a Tailwind v4 deduplication issue, not a bug. Do not remove them.

### Path alias

`@/*` resolves to `./src/*` (configured in `tsconfig.json`).

## PR requirements

All PRs targeting `main` must include a `task:#N` reference in the title or body (e.g., `task: #241`). The `require-task-ref` GitHub Actions workflow enforces this and will block merge if missing. Task numbers are tracked at `https://rd.sdtads.com`.
