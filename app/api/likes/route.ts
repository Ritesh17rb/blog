import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get("slug");
  if (!slug) {
    return NextResponse.json({ error: "Missing slug" }, { status: 400 });
  }

  const like = await prisma.like.findUnique({ where: { postSlug: slug } });
  return NextResponse.json({ count: like?.count ?? 0 });
}

export async function POST(request: NextRequest) {
  const { slug } = await request.json();
  if (!slug) {
    return NextResponse.json({ error: "Missing slug" }, { status: 400 });
  }

  const like = await prisma.like.upsert({
    where: { postSlug: slug },
    update: { count: { increment: 1 } },
    create: { postSlug: slug, count: 1 },
  });

  return NextResponse.json({ count: like.count });
}
