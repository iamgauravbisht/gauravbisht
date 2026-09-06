import fs from "fs";
import path from "path";

import { CONTENT_DIRECTORY, readMarkdownFile } from "./markdown";

const overviewPath = path.join(CONTENT_DIRECTORY, "overview/myself.article.md");

export type Overview = {
  title: string;
  description: string;
  content: string;
};

export function getOverview(): Overview | undefined {
  if (!fs.existsSync(overviewPath)) {
    return undefined;
  }

  const { frontmatter, content } = readMarkdownFile(overviewPath);

  return {
    title: frontmatter.title ?? "",
    description: frontmatter.description ?? "",
    content,
  };
}
