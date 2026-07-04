import { getAllPosts, getPostSource } from "@/lib/posts";
import { buildAboutText, buildProjectsText } from "@/lib/profile";

export type KnowledgeDoc = {
  id: string;
  title: string;
  content: string;
  url: string;
};

export function getKnowledgeDocs(): KnowledgeDoc[] {
  const posts: KnowledgeDoc[] = getAllPosts().map((post) => ({
    id: `post:${post.slug}`,
    title: post.title,
    content: getPostSource(post.slug).content,
    url: `/blog/${post.slug}`,
  }));

  const about: KnowledgeDoc = {
    id: "about",
    title: "About Ritesh",
    content: buildAboutText(),
    url: "/about",
  };

  const projects: KnowledgeDoc = {
    id: "projects",
    title: "Projects",
    content: buildProjectsText(),
    url: "/projects",
  };

  return [...posts, about, projects];
}
