import Link from "next/link";

import type { Section } from "../../lib/content/sections";
import Arrow from "../ui/Arrow";
import TagList from "../ui/TagList";

type Props = {
  sections: Section[];
  getArticleCount?: (sectionSlug: string) => number;
  numbered?: boolean;
};

export default function SectionGrid({
  sections,
  getArticleCount,
  numbered = false,
}: Props) {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {sections.map((section, index) => {
        const articleCount = getArticleCount?.(section.slug);
        const titleClass = numbered
          ? "mt-3 text-xl font-semibold tracking-tight"
          : "text-xl font-semibold tracking-tight";

        return (
          <Link
            key={section.slug}
            href={`/blog/${section.slug}`}
            className="group rounded-2xl border border-gray-200 p-7 transition duration-200 hover:-translate-y-1 hover:border-gray-400 hover:shadow-sm"
          >
            <div className="flex items-start justify-between gap-6">
              <div>
                {numbered && (
                  <p className="text-xs font-medium uppercase tracking-widest text-gray-400">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                )}

                <h3 className={titleClass}>{section.title}</h3>
              </div>

              <Arrow />
            </div>

            {section.description && (
              <p className="mt-4 leading-7 text-gray-600">
                {section.description}
              </p>
            )}

            {articleCount !== undefined ? (
              <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-gray-500">
                <span>
                  {articleCount} {articleCount === 1 ? "article" : "articles"}
                </span>

                {section.tags.length > 0 && (
                  <>
                    <span className="h-1 w-1 rounded-full bg-gray-300" />
                    <span>{section.tags.slice(0, 3).join(" · ")}</span>
                  </>
                )}
              </div>
            ) : (
              <TagList tags={section.tags.slice(0, 4)} className="mt-6" />
            )}
          </Link>
        );
      })}
    </div>
  );
}
