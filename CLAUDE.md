# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server at http://localhost:3000
npm run build    # Production build
npm run start    # Start production server (after build)
npm run lint     # Run Next.js linter
```

## Architecture

**Stack:** Next.js 15 (App Router) + React 19 + Tailwind CSS (dark mode via `class` strategy)

**Content system:** Markdown files in `content/{blog,research,ideas}/` are parsed at build time using `gray-matter` (frontmatter) + `remark`/`remark-html` (body). All content utilities live in `src/lib/content.js` — `getPostsByType(type)` and `getPostBySlug(type, slug)`.

**GitHub integration:** `src/lib/github.js` fetches public repos for `ananyasingh` from the GitHub API (non-forked, sorted by stars, cached 1hr via Next.js fetch). The `/projects` page is a server component that calls this at request time.

**Routing:** All pages live under `src/app/` using Next.js file-based routing. Dynamic post routes use `[slug]` segments with `generateStaticParams()` for static generation.

**Styling:** Tailwind utility classes throughout. The `@tailwindcss/typography` plugin provides `prose prose-invert prose-zinc` styles for rendered markdown content in post detail pages.

## Adding Content

Drop a `.md` file into the appropriate `content/` directory. Required frontmatter:

```markdown
---
title: "Post Title"
date: "2026-02-22"
summary: "Shown in listing cards and page metadata"
tags: ["tag1", "tag2"]
---
```

The slug is derived from the filename. No code changes needed — the page will be statically generated on next build.
