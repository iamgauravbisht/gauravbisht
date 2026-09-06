import { notFound } from "next/navigation";
import Link from "next/link";

import SiteShell from "../components/SiteShell";
import { getOverview } from "../lib/content/overview";
import { markdownToHtml } from "../lib/content/markdown";

export default async function OverviewPage() {
  const overview = getOverview();

  if (!overview) {
    notFound();
  }

  const contentHtml = await markdownToHtml(overview.content);

  return (
    <SiteShell activePage="about">
      <article className="mx-auto max-w-3xl py-16 md:py-20">
        <header className="mb-12">
          <p className="text-sm font-semibold uppercase tracking-widest text-gray-500">
            About
          </p>

          <h1 className="mt-4 text-5xl font-bold tracking-tight md:text-6xl">
            {overview.title}
          </h1>

          {overview.description && (
            <p className="mt-6 text-xl leading-8 text-gray-600">
              {overview.description}
            </p>
          )}
        </header>

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

      <footer className="border-t border-gray-200">
        <div className="flex items-center justify-between py-10 text-sm">
          <Link
            href="/"
            className="font-medium text-gray-500 transition hover:text-black"
          >
            ← Home
          </Link>

          <Link
            href="/blog"
            className="font-medium text-gray-500 transition hover:text-black"
          >
            Read the blog →
          </Link>
        </div>
      </footer>
    </SiteShell>
  );
}
