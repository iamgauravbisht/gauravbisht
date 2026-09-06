import Link from "next/link";
import { getAllSections } from "../../lib/content/sections";
import { getAllPosts } from "../../lib/content/posts";

type Props = {
  currentSlug?: string;
};

export default function BlogSidebar({ currentSlug }: Props) {
  const sections = getAllSections();
  const posts = getAllPosts();

  return (
    <aside className="hidden w-64 shrink-0 lg:block">
      <div className="sticky top-10">
        <div className="border-r pr-8">
          {/* Blog */}
          <div className="mb-8">
            <Link
              href="/blog"
              className="text-sm font-semibold uppercase tracking-wider text-gray-500 hover:text-black"
            >
              Blog
            </Link>
          </div>

          {/* Sections */}
          <nav className="space-y-8">
            {sections.map((section) => {
              const sectionPosts = posts.filter(
                (post) =>
                  post.section === section.slug && post.slug !== section.slug,
              );

              return (
                <div key={section.slug}>
                  {/* Section */}
                  <Link
                    href={`/blog/${section.slug}`}
                    className={`block text-sm font-semibold ${
                      currentSlug === section.slug
                        ? "text-black"
                        : "text-gray-700 hover:text-black"
                    }`}
                  >
                    {section.title}
                  </Link>

                  {/* Articles */}
                  {sectionPosts.length > 0 && (
                    <div className="mt-3 space-y-1 border-l pl-4">
                      {sectionPosts.map((post) => {
                        const isActive = currentSlug === post.slug;

                        return (
                          <Link
                            key={post.slug}
                            href={`/blog/${post.slug}`}
                            className={`block py-1.5 text-sm leading-5 transition ${
                              isActive
                                ? "font-medium text-black"
                                : "text-gray-500 hover:text-black"
                            }`}
                          >
                            {post.title}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>
      </div>
    </aside>
  );
}
