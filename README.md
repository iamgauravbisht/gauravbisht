# Gaurav Bisht

Personal portfolio and writing site built with Next.js, React, TypeScript, and
Tailwind CSS. The site is content-driven: pages are rendered from markdown files
under `content/`, then exported as static HTML.

## Tech Stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- Markdown via `gray-matter`, `remark`, and `remark-html`
- Static export via `output: "export"` in `next.config.ts`

## Getting Started

Install dependencies:

```bash
npm install
```

Run the local development server:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Scripts

```bash
npm run dev
npm run lint
npx tsc --noEmit
npm run build
```

`npm run build` uses `next build --webpack`. This avoids a Turbopack issue seen
in this environment while keeping the production/static export path verified.

## Project Structure

```text
app/
  blog/
    [...slug]/page.tsx       Dynamic section/article route
    page.tsx                 Blog landing page
  components/
    SiteShell.tsx            Shared page shell and top navigation
    blog/                    Blog-specific list/layout/sidebar components
    ui/                      Small shared UI primitives
  lib/
    content/                 Markdown loading, parsing, TOC helpers
    format.ts                Shared formatting helpers
  overview/page.tsx          About page
  page.tsx                   Home page

content/
  overview/
    myself.article.md        About page content
  sections/
    <section>/article.md     Section landing content
    <section>/<post>/article.md
                               Blog article content
```

## Content Model

Section and article markdown files use frontmatter:

```md
---
title: "What is CAP Theorem?"
description: "Understanding consistency, availability and partition tolerance."
date: "2026-09-06"
tags:
  - system-design
published: true
---
```

Rules:

- A top-level `content/sections/<section>/article.md` is a section page.
- A nested `content/sections/<section>/<article>/article.md` is an article page.
- Only files with `published: true` are shown.
- Dates are sorted newest first.
- Article headings generate stable IDs for the table of contents.

## Documentation

- [contribute.md](./contribute.md) explains how to make changes safely.
- [KT.md](./KT.md) walks a new developer through the codebase and request flow.
