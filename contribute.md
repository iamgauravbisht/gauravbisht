# Contributing

This is a small content-driven Next.js site, so contributions should stay
focused, readable, and easy to verify.

## Local Workflow

1. Install dependencies with `npm install`.
2. Run `npm run dev` for local development.
3. Make a focused change.
4. Run verification before handing off:

```bash
npm run lint
npx tsc --noEmit
npm run build
```

## Engineering Guidelines

- Prefer existing patterns over new abstractions.
- Keep shared behavior in `app/lib` or reusable components.
- Keep page files mostly about composition and route-specific decisions.
- Avoid duplicating markdown parsing, date formatting, card layouts, empty
  states, or article list rendering.
- Do not mix unrelated formatting or redesign work into feature changes.
- Keep content changes separate from code changes when possible.

## Content Guidelines

Add section pages here:

```text
content/sections/<section-slug>/article.md
```

Add article pages here:

```text
content/sections/<section-slug>/<article-slug>/article.md
```

Use this frontmatter shape:

```md
---
title: "Article title"
description: "Short summary used in lists and headers."
date: "YYYY-MM-DD"
tags:
  - example-tag
published: true
---
```

Notes:

- Use lowercase kebab-case for folder slugs.
- Set `published: false` for drafts.
- Keep descriptions short and plain.
- Use `##` and `###` headings inside articles when you want them to appear in
  the table of contents.

## UI Guidelines

- Keep shared UI in `app/components`.
- Use `app/components/ui` for small primitives.
- Use `app/components/blog` for blog-specific layouts and lists.
- Preserve the current visual language unless the task is explicitly a redesign.
- Avoid adding dependencies for small UI changes.

## Build Notes

The project is configured for static export with `output: "export"`.

The build script uses webpack:

```bash
npm run build
```

This is intentional because Turbopack produced an internal process/port error
in the current environment.
