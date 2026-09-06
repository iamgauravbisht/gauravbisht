import Link from "next/link";

import BlogLayout from "../components/blog/BlogLayout";
import ArticleList from "../components/blog/ArticleList";
import SectionGrid from "../components/blog/SectionGrid";
import EmptyState from "../components/ui/EmptyState";
import { getAllPosts } from "../lib/content/posts";
import { getAllSections } from "../lib/content/sections";

export default function BlogPage() {
  const sections = getAllSections();
  const posts = getAllPosts();
  const getArticleCount = (sectionSlug: string) =>
    posts.filter((post) => post.section === sectionSlug && post.slug !== sectionSlug)
      .length;
  const getSectionTitle = (sectionSlug: string) =>
    sections.find((section) => section.slug === sectionSlug)?.title ?? sectionSlug;

  return (
    <BlogLayout currentSlug="">
      <header className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-widest text-gray-500">
          Writing
        </p>

        <h1 className="mt-3 text-5xl font-bold tracking-tight md:text-6xl">
          Blog
        </h1>

        <p className="mt-6 text-lg leading-8 text-gray-600">
          Notes, ideas and things I&apos;m learning about software engineering, AI
          and system design.
        </p>
      </header>

      <section className="mt-16">
        <SectionHeading eyebrow="Explore" title="Sections" />

        {sections.length === 0 ? (
          <EmptyState
            title="No sections yet"
            description="Published sections will appear here."
          />
        ) : (
          <SectionGrid sections={sections} getArticleCount={getArticleCount} />
        )}
      </section>

      <section className="mt-20 border-t border-gray-200 pt-16">
        <SectionHeading eyebrow="Recently published" title="Latest articles" />

        {posts.length === 0 ? (
          <EmptyState
            title="No articles yet"
            description="Published articles will appear here."
          />
        ) : (
          <ArticleList
            posts={posts.slice(0, 5)}
            getSectionTitle={getSectionTitle}
          />
        )}
      </section>

      <div className="mt-16 flex items-center justify-between border-t border-gray-200 py-10">
        <Link
          href="/"
          className="text-sm font-medium text-gray-500 transition hover:text-black"
        >
          ← Home
        </Link>

        <Link
          href="/overview"
          className="text-sm font-medium text-gray-500 transition hover:text-black"
        >
          About →
        </Link>
      </div>
    </BlogLayout>
  );
}

function SectionHeading({
  eyebrow,
  title,
}: {
  eyebrow: string;
  title: string;
}) {
  return (
    <div className="mb-8">
      <p className="text-sm font-semibold uppercase tracking-widest text-gray-500">
        {eyebrow}
      </p>

      <h2 className="mt-2 text-3xl font-bold tracking-tight">{title}</h2>
    </div>
  );
}
