import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  const { name, email, body } = await request.json();

  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof body !== "string" ||
    !name.trim() ||
    !EMAIL_RE.test(email) ||
    !body.trim()
  ) {
    return NextResponse.json({ error: "Invalid fields" }, { status: 400 });
  }

  await prisma.message.create({
    data: {
      name: name.trim().slice(0, 100),
      email: email.trim().slice(0, 200),
      body: body.trim().slice(0, 2000),
    },
  });

  return NextResponse.json({ ok: true });
}
