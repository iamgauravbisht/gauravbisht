import Link from "next/link";
import { getAllSections } from "../../lib/content/sections";
import { getAllPosts } from "../../lib/content/posts";

type Props = {
  currentSlug?: string;
};

type NavNode = {
  segment: string;
  slug: string;
  title: string;
  children: NavNode[];
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
              const sectionTree = buildSectionTree(section.slug, sectionPosts);

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
                  {sectionTree.length > 0 && (
                    <NavTree nodes={sectionTree} currentSlug={currentSlug} />
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

function NavTree({
  nodes,
  currentSlug,
  depth = 0,
}: {
  nodes: NavNode[];
  currentSlug?: string;
  depth?: number;
}) {
  return (
    <div className={`${depth === 0 ? "mt-3" : "mt-1"} space-y-1 border-l pl-4`}>
      {nodes.map((node) => {
        const isActive = currentSlug === node.slug;

        return (
          <div key={node.slug}>
            <Link
              href={`/blog/${node.slug}`}
              className={`block py-1.5 text-sm leading-5 transition ${
                isActive
                  ? "font-medium text-black"
                  : "text-gray-500 hover:text-black"
              }`}
            >
              {node.title}
            </Link>

            {node.children.length > 0 && (
              <NavTree
                nodes={node.children}
                currentSlug={currentSlug}
                depth={depth + 1}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function buildSectionTree(
  sectionSlug: string,
  posts: ReturnType<typeof getAllPosts>,
): NavNode[] {
  const nodesBySlug = new Map<string, NavNode>();
  const roots: NavNode[] = [];

  posts.forEach((post) => {
    const segments = post.slug.split("/").slice(1);

    segments.forEach((segment, index) => {
      const slug = [sectionSlug, ...segments.slice(0, index + 1)].join("/");
      const existingNode = nodesBySlug.get(slug);

      if (!existingNode) {
        const node = {
          segment,
          slug,
          title: slug === post.slug ? post.title : segment,
          children: [],
        };
        const parentSlug = [sectionSlug, ...segments.slice(0, index)].join("/");
        const parentNode = nodesBySlug.get(parentSlug);

        nodesBySlug.set(slug, node);

        if (parentNode) {
          parentNode.children.push(node);
        } else {
          roots.push(node);
        }
      } else if (slug === post.slug) {
        existingNode.title = post.title;
      }
    });
  });

  return roots;
}
