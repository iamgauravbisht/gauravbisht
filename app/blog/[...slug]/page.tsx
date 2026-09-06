import { notFound } from "next/navigation";
import Link from "next/link";

import {
  getAllPosts,
  getPost,
  getPostsBySection,
} from "../../lib/content/posts";

import { getAllSections, getSection } from "../../lib/content/sections";

import { getTableOfContents } from "../../lib/content/toc";
import { markdownToHtml } from "../../lib/content/markdown";
import { formatDate } from "../../lib/format";

import ArticleList from "../../components/blog/ArticleList";
import BlogLayout from "../../components/blog/BlogLayout";
import TableOfContents from "../../components/blog/TableOfContents";
import EmptyState from "../../components/ui/EmptyState";
import TagList from "../../components/ui/TagList";

type Props = {
  params: Promise<{
    slug: string[];
  }>;
};

/*
 * ============================================================
 * STATIC PARAMS
 * ============================================================
 *
 * Generates all static routes required for:
 *
 * /blog/system-design
 * /blog/system-design/cap-theorem
 * /blog/system-design/load-balancing
 *
 * Required because next.config.ts uses:
 *
 * output: "export"
 *
 * ============================================================
 */

export function generateStaticParams() {
  const sections = getAllSections();
  const posts = getAllPosts();

  const sectionParams = sections.map((section) => ({
    slug: [section.slug],
  }));

  const postParams = posts
    .filter((post) => post.slug.includes("/"))
    .map((post) => ({
      slug: post.slug.split("/"),
    }));

  return [...sectionParams, ...postParams];
}

/*
 * ============================================================
 * BLOG ROUTE
 * ============================================================
 *
 * Handles:
 *
 * /blog/system-design
 * /blog/system-design/cap-theorem
 * /blog/system-design/load-balancing
 *
 * ============================================================
 */

export default async function BlogPage({ params }: Props) {
  const { slug } = await params;

  const fullSlug = slug.join("/");

  /*
   * ==========================================================
   * SECTION PAGE
   * ==========================================================
   *
   * Example:
   *
   * /blog/system-design
   *
   * slug:
   *
   * ["system-design"]
   *
   * ==========================================================
   */

  if (slug.length === 1) {
    const section = getSection(slug[0]);

    if (!section) {
      notFound();
    }

    const posts = getPostsBySection(section.slug);

    /*
     * ========================================================
     * MARKDOWN → HTML
     * ========================================================
     */

    const contentHtml = await markdownToHtml(section.content);

    return (
      <BlogLayout currentSlug={section.slug}>
        {/* ==================================================
            BREADCRUMB
        ================================================== */}

        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="transition hover:text-black">
            Home
          </Link>

          <span>/</span>

          <Link href="/blog" className="transition hover:text-black">
            Blog
          </Link>

          <span>/</span>

          <span className="text-gray-900">{section.title}</span>
        </div>

        {/* ==================================================
            SECTION HEADER
        ================================================== */}

        <header className="mt-10 max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-gray-500">
            Section
          </p>

          <h1 className="mt-4 text-5xl font-bold tracking-tight md:text-6xl">
            {section.title}
          </h1>

          {section.description && (
            <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-600 md:text-xl">
              {section.description}
            </p>
          )}

          <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-3 text-sm text-gray-500">
            <span>
              {posts.length} {posts.length === 1 ? "article" : "articles"}
            </span>

            {section.tags.length > 0 && (
              <>
                <span className="h-1 w-1 rounded-full bg-gray-300" />

                <TagList tags={section.tags} prefix="#" />
              </>
            )}
          </div>
        </header>

        {/* ==================================================
            SECTION INTRODUCTION
        ================================================== */}

        {contentHtml && (
          <section className="mt-14 max-w-3xl border-t border-gray-200 pt-12">
            <div
              className="
                prose
                prose-lg
                max-w-none
                prose-headings:font-semibold
                prose-headings:tracking-tight
                prose-p:leading-8
                prose-a:text-black
                prose-a:underline
                prose-strong:text-black
                prose-code:rounded
                prose-code:bg-gray-100
                prose-code:px-1.5
                prose-code:py-0.5
                prose-code:text-sm
                prose-code:before:content-none
                prose-code:after:content-none
              "
              dangerouslySetInnerHTML={{
                __html: contentHtml,
              }}
            />
          </section>
        )}

        {/* ==================================================
            ARTICLES
        ================================================== */}

        <section className="mt-20 border-t border-gray-200 pt-16">
          <div className="mb-10">
            <p className="text-sm font-semibold uppercase tracking-widest text-gray-500">
              Writing
            </p>

            <h2 className="mt-2 text-3xl font-bold tracking-tight">Articles</h2>

            <p className="mt-3 text-gray-600">
              Articles and notes from this section.
            </p>
          </div>

          {posts.length === 0 ? (
            <EmptyState
              title="No articles yet"
              description="Articles published in this section will appear here."
            />
          ) : (
            <ArticleList posts={posts} titleSize="large" />
          )}
        </section>

        {/* ==================================================
            SECTION NAVIGATION
        ================================================== */}

        <div className="mt-16 flex items-center justify-between border-t border-gray-200 py-10">
          <Link
            href="/blog"
            className="text-sm font-medium text-gray-500 transition hover:text-black"
          >
            ← All sections
          </Link>

          <Link
            href="/"
            className="text-sm font-medium text-gray-500 transition hover:text-black"
          >
            Home →
          </Link>
        </div>
      </BlogLayout>
    );
  }

  /*
   * ==========================================================
   * ARTICLE PAGE
   * ==========================================================
   *
   * Example:
   *
   * /blog/system-design/cap-theorem
   *
   * slug:
   *
   * ["system-design", "cap-theorem"]
   *
   * ==========================================================
   */

  const post = getPost(fullSlug);

  if (!post) {
    notFound();
  }

  /*
   * ==========================================================
   * TABLE OF CONTENTS
   * ==========================================================
   */

  const toc = getTableOfContents(post.content);

  /*
   * ==========================================================
   * MARKDOWN → HTML
   * ==========================================================
   */

  const contentHtml = await markdownToHtml(post.content, { headingIds: true });

  return (
    <BlogLayout currentSlug={post.slug}>
      {/* ==================================================
          BREADCRUMB
      ================================================== */}

      <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
        <Link href="/" className="transition hover:text-black">
          Home
        </Link>

        <span>/</span>

        <Link href="/blog" className="transition hover:text-black">
          Blog
        </Link>

        <span>/</span>

        <Link
          href={`/blog/${post.section}`}
          className="transition hover:text-black"
        >
          {post.section}
        </Link>

        <span>/</span>

        <span className="text-gray-900">{post.title}</span>
      </div>

      {/* ==================================================
          ARTICLE + TOC
      ================================================== */}

      <div className="mt-12 flex items-start justify-center gap-12">
        {/* ==================================================
            ARTICLE
        ================================================== */}

        <article className="min-w-0 max-w-3xl flex-1">
          {/* Article Header */}

          <header className="mb-10">
            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
              {post.date && (
                <time dateTime={post.date}>
                  {formatDate(post.date, {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </time>
              )}

              {post.tags.length > 0 && (
                <>
                  <span className="h-1 w-1 rounded-full bg-gray-300" />

                  <span>{post.tags.slice(0, 4).join(" · ")}</span>
                </>
              )}
            </div>

            <h1 className="mt-4 text-5xl font-bold tracking-tight md:text-6xl">
              {post.title}
            </h1>

            {post.description && (
              <p className="mt-6 text-xl leading-8 text-gray-600">
                {post.description}
              </p>
            )}

            {post.tags.length > 0 && (
              <TagList tags={post.tags} prefix="#" className="mt-6" />
            )}
          </header>

          {/* Article Content */}

          <div
            className="
                prose
                prose-lg
                max-w-none
                prose-headings:font-semibold
                prose-headings:tracking-tight
                prose-p:leading-8
                prose-a:text-black
                prose-a:underline
                prose-strong:text-black

                prose-code:rounded
                prose-code:bg-gray-100
                prose-code:px-1.5
                prose-code:py-0.5
                prose-code:text-sm
                prose-code:text-gray-800
                prose-code:before:content-none
                prose-code:after:content-none

                prose-pre:overflow-x-auto
                prose-pre:rounded-xl
                prose-pre:bg-gray-900
                prose-pre:text-gray-100

                [&_pre_code]:bg-transparent
                [&_pre_code]:p-0
                [&_pre_code]:text-gray-100
            "
            dangerouslySetInnerHTML={{
              __html: contentHtml,
            }}
          />
        </article>

        {/* ==================================================
            TABLE OF CONTENTS
        ================================================== */}

        <TableOfContents items={toc} />
      </div>
    </BlogLayout>
  );
}
