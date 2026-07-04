import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get("slug");
  if (!slug) {
    return NextResponse.json({ error: "Missing slug" }, { status: 400 });
  }

  const comments = await prisma.comment.findMany({
    where: { postSlug: slug },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ comments });
}

export async function POST(request: NextRequest) {
  const json = await request.json();
  const { slug, name, body } = json;

  if (!slug || typeof name !== "string" || typeof body !== "string" || !name.trim() || !body.trim()) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const comment = await prisma.comment.create({
    data: {
      postSlug: slug,
      name: name.trim().slice(0, 60),
      body: body.trim().slice(0, 1000),
    },
  });

  return NextResponse.json({ comment });
}
