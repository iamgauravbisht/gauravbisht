import Link from "next/link";

import SiteShell from "./components/SiteShell";
import ArticleList from "./components/blog/ArticleList";
import SectionGrid from "./components/blog/SectionGrid";
import EmptyState from "./components/ui/EmptyState";
import { getAllPosts } from "./lib/content/posts";
import { getAllSections } from "./lib/content/sections";

export default function Home() {
  const sections = getAllSections();
  const posts = getAllPosts();
  const latestPosts = posts.slice(0, 5);
  const getSectionTitle = (sectionSlug: string) =>
    sections.find((section) => section.slug === sectionSlug)?.title;

  return (
    <SiteShell activePage="blog">
      <section className="relative py-24 md:py-32">
        <div className="max-w-4xl">
          <div className="flex items-center gap-3 text-sm font-medium uppercase tracking-widest text-gray-500">
            <span className="h-2 w-2 rounded-full bg-black" />
            <span>Software Engineer</span>
          </div>

          <h1 className="mt-6 text-5xl font-bold tracking-[-0.04em] sm:text-6xl md:text-7xl">
            Building things,
            <br />
            understanding how
            <br />
            they work.
          </h1>

          <p className="mt-8 max-w-2xl text-lg leading-8 text-gray-600 md:text-xl">
            I build software and write about the things I learn along the way -
            from AI and backend engineering to system design, architecture and
            the systems behind modern applications.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/blog"
              className="rounded-lg bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
            >
              Read the blog
            </Link>

            <Link
              href="/overview"
              className="rounded-lg border border-gray-200 px-5 py-3 text-sm font-medium transition hover:border-gray-400 hover:bg-gray-50"
            >
              About me
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-gray-200 py-20">
        <SectionHeading
          eyebrow="Explore"
          title="What I write about"
          description="Areas I'm exploring, building in and trying to understand deeply."
        />

        {sections.length === 0 ? (
          <EmptyState
            title="No sections yet"
            description="Published sections will appear here."
          />
        ) : (
          <SectionGrid sections={sections} numbered />
        )}
      </section>

      <section className="border-t border-gray-200 py-20">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="Writing"
            title="Latest articles"
            description="Recent things I've been learning and writing about."
            compact
          />

          <Link
            href="/blog"
            className="shrink-0 text-sm font-medium text-gray-500 transition hover:text-black"
          >
            View all articles →
          </Link>
        </div>

        {latestPosts.length === 0 ? (
          <EmptyState
            title="No articles yet"
            description="Published articles will appear here."
          />
        ) : (
          <ArticleList posts={latestPosts} getSectionTitle={getSectionTitle} />
        )}
      </section>

      <section className="border-t border-gray-200 py-20">
        <div className="rounded-3xl bg-gray-50 px-7 py-12 md:px-12 md:py-16">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-gray-500">
              About
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
              Curious about the person behind the notes?
            </h2>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-gray-600">
              Learn more about me, what I&apos;m working on and the things I&apos;m
              interested in.
            </p>

            <Link
              href="/overview"
              className="mt-8 inline-flex rounded-lg bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
            >
              More about me →
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-gray-200 py-10">
        <div className="flex flex-col gap-4 text-sm text-gray-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Gaurav</p>

          <div className="flex items-center gap-5">
            <Link href="/overview" className="transition hover:text-black">
              About
            </Link>

            <Link href="/blog" className="transition hover:text-black">
              Blog
            </Link>
          </div>
        </div>
      </footer>
    </SiteShell>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
  compact = false,
}: {
  eyebrow: string;
  title: string;
  description: string;
  compact?: boolean;
}) {
  return (
    <div className={compact ? "" : "mb-10 max-w-2xl"}>
      <p className="text-sm font-semibold uppercase tracking-widest text-gray-500">
        {eyebrow}
      </p>

      <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
        {title}
      </h2>

      <p className="mt-4 leading-7 text-gray-600">{description}</p>
    </div>
  );
}
