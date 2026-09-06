import Link from "next/link";

import type { Post } from "../../lib/content/posts";
import { formatDate } from "../../lib/format";
import Arrow from "../ui/Arrow";

type Props = {
  posts: Post[];
  getSectionTitle?: (sectionSlug: string) => string | undefined;
  titleSize?: "base" | "large";
};

export default function ArticleList({
  posts,
  getSectionTitle,
  titleSize = "base",
}: Props) {
  return (
    <div className="divide-y divide-gray-200 border-y border-gray-200">
      {posts.map((post, index) => (
        <ArticleRow
          key={post.slug}
          getSectionTitle={getSectionTitle}
          index={index}
          post={post}
          titleSize={titleSize}
        />
      ))}
    </div>
  );
}

function ArticleRow({
  post,
  index,
  getSectionTitle,
  titleSize,
}: {
  post: Post;
  index: number;
  getSectionTitle?: (sectionSlug: string) => string | undefined;
  titleSize: "base" | "large";
}) {
  const sectionTitle = getSectionTitle?.(post.section);
  const titleClass =
    titleSize === "large"
      ? "text-2xl font-semibold tracking-tight transition group-hover:text-gray-600"
      : "text-xl font-semibold tracking-tight transition group-hover:text-gray-600 md:text-2xl";

  return (
    <Link href={`/blog/${post.slug}`} className="group block py-7">
      <div className="flex gap-6 md:gap-8">
        <div className="hidden w-8 shrink-0 pt-1 text-sm font-medium text-gray-400 sm:block">
          {String(index + 1).padStart(2, "0")}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-6">
            <div className="max-w-3xl">
              {(sectionTitle || post.date) && (
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs font-medium uppercase tracking-wider text-gray-500">
                  {sectionTitle && <span>{sectionTitle}</span>}

                  {sectionTitle && post.date && (
                    <span className="h-1 w-1 rounded-full bg-gray-300" />
                  )}

                  {post.date && (
                    <time dateTime={post.date}>{formatDate(post.date)}</time>
                  )}
                </div>
              )}

              <h3 className={`mt-3 ${titleClass}`}>{post.title}</h3>

              {post.description && (
                <p className="mt-2 leading-7 text-gray-600">
                  {post.description}
                </p>
              )}

              {post.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-x-3 gap-y-1 text-sm text-gray-500">
                  {post.tags.slice(0, 4).map((tag) => (
                    <span key={tag}>#{tag}</span>
                  ))}
                </div>
              )}
            </div>

            <Arrow />
          </div>
        </div>
      </div>
    </Link>
  );
}
