import { unified } from "unified";
import remarkParse from "remark-parse";
import { visit } from "unist-util-visit";
import GithubSlugger from "github-slugger";
import type { Root, Heading, Text } from "mdast";

export type TocItem = { id: string; text: string; level: number };

export function extractToc(content: string): TocItem[] {
  const tree = unified().use(remarkParse).parse(content) as Root;
  const slugger = new GithubSlugger();
  const items: TocItem[] = [];

  visit(tree, "heading", (node: Heading) => {
    if (node.depth < 2 || node.depth > 3) return;
    const text = node.children
      .filter((child): child is Text => child.type === "text")
      .map((child) => child.value)
      .join("");
    if (!text) return;
    items.push({ id: slugger.slug(text), text, level: node.depth });
  });

  return items;
}
