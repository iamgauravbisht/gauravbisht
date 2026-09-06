import fs from "fs";
import path from "path";

import {
  byNewestDate,
  getTags,
  published,
  readMarkdownFile,
  SECTIONS_DIRECTORY,
} from "./markdown";

export type Section = {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  published: boolean;
  content: string;
};

export function getAllSections(): Section[] {
  const articleFiles = getTopLevelSectionArticleFiles();

  const sections = articleFiles.map((articlePath) => {
    const slug = path.basename(path.dirname(articlePath));
    const { frontmatter, content } = readMarkdownFile(articlePath);

    return {
      slug,
      title: frontmatter.title ?? slug,
      description: frontmatter.description ?? "",
      date: frontmatter.date ?? "",
      tags: getTags(frontmatter),
      published: frontmatter.published ?? false,
      content,
    };
  });

  return byNewestDate(published(sections));
}

export function getSection(slug: string): Section | undefined {
  return getAllSections().find((section) => section.slug === slug);
}

function getTopLevelSectionArticleFiles() {
  return fs.existsSync(SECTIONS_DIRECTORY)
    ? fs
        .readdirSync(SECTIONS_DIRECTORY, { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .map((entry) => entry.name)
        .map((slug) => path.join(SECTIONS_DIRECTORY, slug, "article.md"))
        .filter((articlePath) => fs.existsSync(articlePath))
    : [];
}
