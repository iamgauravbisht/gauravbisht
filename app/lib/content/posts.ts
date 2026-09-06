import {
  byNewestDate,
  getArticleFiles,
  getSlugFromArticlePath,
  getTags,
  published,
  readMarkdownFile,
  SECTIONS_DIRECTORY,
} from "./markdown";

export type Post = {
  slug: string;
  section: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  published: boolean;
  content: string;
};

export function getAllPosts(): Post[] {
  const articleFiles = getArticleFiles(SECTIONS_DIRECTORY);

  const posts = articleFiles.map((filePath) => {
    const { frontmatter, content } = readMarkdownFile(filePath);
    const slug = getSlugFromArticlePath(filePath, SECTIONS_DIRECTORY);
    const [section] = slug.split("/");

    return {
      slug,
      section,
      title: frontmatter.title ?? "",
      description: frontmatter.description ?? "",
      date: frontmatter.date ?? "",
      tags: getTags(frontmatter),
      published: frontmatter.published ?? false,
      content,
    };
  });

  return byNewestDate(published(posts));
}

export function getPost(slug: string): Post | undefined {
  return getAllPosts().find((post) => post.slug === slug);
}

export function getPostsBySection(section: string): Post[] {
  return getAllPosts().filter(
    (post) => post.section === section && post.slug !== section,
  );
}
