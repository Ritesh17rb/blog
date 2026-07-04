import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resend } from "@/lib/resend";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NOTIFY_EMAIL = "ritesh17lifeamazing@gmail.com";

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

  const trimmedName = name.trim().slice(0, 100);
  const trimmedEmail = email.trim().slice(0, 200);
  const trimmedBody = body.trim().slice(0, 2000);

  await prisma.message.create({
    data: { name: trimmedName, email: trimmedEmail, body: trimmedBody },
  });

  try {
    await resend.emails.send({
      from: "ritesh.dev <onboarding@resend.dev>",
      to: NOTIFY_EMAIL,
      replyTo: trimmedEmail,
      subject: `New contact form message from ${trimmedName}`,
      text: `From: ${trimmedName} <${trimmedEmail}>\n\n${trimmedBody}`,
    });
  } catch (error) {
    console.error("Failed to send contact notification email", error);
  }

  return NextResponse.json({ ok: true });
}
