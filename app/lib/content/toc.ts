import type { Heading } from "mdast";
import { remark } from "remark";
import { visit } from "unist-util-visit";

import { createUniqueHeadingId, getNodeText } from "./markdown";

export type TocItem = {
  id: string;
  title: string;
  level: number;
};

export function getTableOfContents(markdown: string): TocItem[] {
  const tree = remark().parse(markdown);
  const items: TocItem[] = [];
  const usedIds = new Map<string, number>();

  visit(tree, "heading", (node: Heading) => {
    if (node.depth < 2 || node.depth > 3) {
      return;
    }

    const text = getNodeText(node).trim();

    if (!text) {
      return;
    }

    items.push({
      id: createUniqueHeadingId(text, usedIds),
      title: text,
      level: node.depth,
    });
  });

  return items;
}
