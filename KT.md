# Knowledge Transfer

This document explains the codebase to a new developer who needs to understand,
debug, or extend the site.

## What This App Is

This is a static personal site with a home page, an about page, and a markdown
powered blog. It uses Next.js App Router, but the data source is local markdown
rather than an external CMS.

At build time, the app:

1. Reads markdown files from `content/`.
2. Parses frontmatter with `gray-matter`.
3. Converts markdown to HTML with `remark`.
4. Generates static pages for all published sections and articles.

## High-Level Flow

```text
content/*.md
  -> app/lib/content/*.ts
  -> app/blog/page.tsx and app/blog/[...slug]/page.tsx
  -> reusable components in app/components
  -> static export build
```

## Key Directories

### `content/`

This is the source of truth for written content.

- `content/overview/myself.article.md` powers `/overview`.
- `content/sections/<section>/article.md` powers `/blog/<section>`.
- `content/sections/<section>/<article>/article.md` powers
  `/blog/<section>/<article>`.

### `app/lib/content/`

This folder owns content loading and markdown processing.

- `markdown.ts` contains shared filesystem, frontmatter, markdown, slug, sort,
  and heading-ID helpers.
- `sections.ts` returns published top-level sections.
- `posts.ts` returns published blog posts and section-filtered posts.
- `overview.ts` returns the about page markdown.
- `toc.ts` builds the article table of contents from `##` and `###` headings.

Keep content rules here. Page components should not know filesystem details.

### `app/components/`

Reusable rendering pieces live here.

- `SiteShell.tsx` renders the shared page shell and navigation.
- `blog/BlogLayout.tsx` adds the blog sidebar around blog routes.
- `blog/BlogSidebar.tsx` renders section/article navigation.
- `blog/SectionGrid.tsx` renders section cards.
- `blog/ArticleList.tsx` renders article rows.
- `blog/TableOfContents.tsx` renders article TOC links.
- `ui/EmptyState.tsx`, `ui/TagList.tsx`, and `ui/Arrow.tsx` are small shared
  primitives.

### `app/blog/[...slug]/page.tsx`

This is the main dynamic route.

It handles two route shapes:

- `/blog/<section>` renders a section page.
- `/blog/<section>/<article>` renders an article page.

`generateStaticParams()` reads all published sections and posts so Next can
pre-render every route for static export.

## Content Types

### Section

Defined in `app/lib/content/sections.ts`.

A section has:

- `slug`
- `title`
- `description`
- `date`
- `tags`
- `published`
- `content`

### Post

Defined in `app/lib/content/posts.ts`.

A post has:

- `slug`, for example `system-design/cap-theorem`
- `section`, for example `system-design`
- `title`
- `description`
- `date`
- `tags`
- `published`
- `content`

## Markdown Rendering

Use `markdownToHtml()` from `app/lib/content/markdown.ts`.

For article pages, pass heading IDs:

```ts
const contentHtml = await markdownToHtml(post.content, { headingIds: true });
```

The TOC and rendered headings share the same ID-generation helper, so links stay
in sync.

## Adding A New Article

1. Create a folder:

```text
content/sections/system-design/new-topic/
```

2. Add `article.md`:

```md
---
title: "New Topic"
description: "Short summary."
date: "2026-09-06"
tags:
  - system-design
published: true
---

# New Topic

## First heading

Article body.
```

3. Run:

```bash
npm run lint
npx tsc --noEmit
npm run build
```

## Adding A New Section

1. Create:

```text
content/sections/new-section/article.md
```

2. Add frontmatter with `published: true`.
3. Add nested article folders when needed.
4. Run the verification commands.

## Common Change Points

- Change top navigation: `app/components/SiteShell.tsx`
- Change blog sidebar: `app/components/blog/BlogSidebar.tsx`
- Change article card/list UI: `app/components/blog/ArticleList.tsx`
- Change section card UI: `app/components/blog/SectionGrid.tsx`
- Change markdown/frontmatter behavior: `app/lib/content/markdown.ts`
- Change route behavior: `app/blog/[...slug]/page.tsx`

## Verification Checklist

Before handing off:

```bash
npm run lint
npx tsc --noEmit
npm run build
```

Expected result: lint passes, TypeScript passes, and the build pre-renders `/`,
`/overview`, `/blog`, and all published blog routes.

## Important Notes

- The app uses static export, so every blog route must be discoverable at build
  time.
- `published: false` content is intentionally hidden.
- Dates are compared with JavaScript `Date`, so keep them in `YYYY-MM-DD`.
- The build script uses webpack intentionally because Turbopack produced an
  internal environment error.
