import { NextResponse } from "next/server";
import { getAllPosts } from "@/lib/posts";

const siteUrl = "https://ritesh.dev";

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function GET() {
  const posts = getAllPosts();

  const items = posts
    .map(
      (post) => `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${siteUrl}/blog/${post.slug}</link>
      <guid>${siteUrl}/blog/${post.slug}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <description>${escapeXml(post.excerpt)}</description>
    </item>`
    )
    .join("");

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>ritesh.dev</title>
    <link>${siteUrl}</link>
    <description>Notes on code, design, and building things.</description>
    ${items}
  </channel>
</rss>`;

  return new NextResponse(feed, {
    headers: { "Content-Type": "application/xml" },
  });
}
