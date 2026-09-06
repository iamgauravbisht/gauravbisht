import fs from "fs";
import path from "path";

import matter from "gray-matter";
import type { Heading, Root } from "mdast";
import { remark } from "remark";
import html from "remark-html";
import { visit } from "unist-util-visit";

export const CONTENT_DIRECTORY = path.join(process.cwd(), "content");
export const SECTIONS_DIRECTORY = path.join(CONTENT_DIRECTORY, "sections");

export type Frontmatter = {
  title?: string;
  description?: string;
  date?: string;
  tags?: string[];
  published?: boolean;
};

export type TextNode = {
  type?: string;
  value?: string;
  children?: TextNode[];
};

export function readMarkdownFile(filePath: string) {
  const fileContents = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(fileContents);

  return {
    frontmatter: data as Frontmatter,
    content,
  };
}

export function getArticleFiles(directory: string): string[] {
  if (!fs.existsSync(directory)) {
    return [];
  }

  return fs
    .readdirSync(directory, { withFileTypes: true })
    .flatMap((entry) => {
      const fullPath = path.join(directory, entry.name);

      if (entry.isDirectory()) {
        return getArticleFiles(fullPath);
      }

      return entry.isFile() && entry.name === "article.md" ? [fullPath] : [];
    });
}

export function getSlugFromArticlePath(filePath: string, root: string) {
  const relativePath = path.relative(root, filePath);
  const directoryPath = path.dirname(relativePath);

  return directoryPath.split(path.sep).join("/");
}

export function byNewestDate<T extends { date: string }>(items: T[]): T[] {
  return [...items].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}

export function published<T extends { published: boolean }>(items: T[]): T[] {
  return items.filter((item) => item.published);
}

export function getTags(frontmatter: Frontmatter) {
  return Array.isArray(frontmatter.tags) ? frontmatter.tags : [];
}

export function slugifyHeading(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

export function getNodeText(node: TextNode | undefined): string {
  if (!node) {
    return "";
  }

  if (node.type === "text" || node.type === "inlineCode") {
    return node.value ?? "";
  }

  return node.children?.map((child) => getNodeText(child)).join("") ?? "";
}

export function createUniqueHeadingId(
  text: string,
  usedIds: Map<string, number>,
) {
  const baseId = slugifyHeading(text);
  const count = usedIds.get(baseId) ?? 0;

  usedIds.set(baseId, count + 1);

  return count === 0 ? baseId : `${baseId}-${count + 1}`;
}

export function remarkHeadingIds() {
  return (tree: Root) => {
    const usedIds = new Map<string, number>();

    visit(tree, "heading", (node: Heading) => {
      const text = getNodeText(node).trim();

      if (!text) {
        return;
      }

      node.data ??= {};
      node.data.hProperties ??= {};
      node.data.hProperties.id = createUniqueHeadingId(text, usedIds);
    });
  };
}

export async function markdownToHtml(
  markdown: string,
  options: { headingIds?: boolean } = {},
) {
  const processor = options.headingIds ? remark().use(remarkHeadingIds) : remark();
  const processedContent = await processor.use(html).process(markdown);

  return processedContent.toString();
}
