import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma/index";
import { hash } from "bcrypt";
import { randomUUID } from "crypto";
import { Resend } from "resend";
import ResetTemplate from "@/emails/reset";

export async function POST(
  req: NextRequest,
  { params }: { params: { token: string } }
) {
  const body = await req.json();

  const { token: forgot } = params;

  if (forgot !== "forgot") {
    return NextResponse.json({ response: "bad" });
  }

  const user = await prisma.user.findFirst({
    where: { email: body.email },
  });

  if (!user) {
    return NextResponse.json({ response: "bad" });
  }

  const token = await prisma.resetToken.create({
    data: {
      token: `${randomUUID()}${randomUUID()}`.replace(/-/g, ""),
      credsId: user.uid,
    },
  });

  const resend = new Resend(process.env.RESEND_API_KEY);

  await resend.emails.send({
    from: "WiredIn <reset@wiredin.social>",
    to: user.email,
    subject: "Reset Your Password",
    react: ResetTemplate({
      token: token.token,
      siteURL: process.env.API_URL || "",
      user: user.displayName,
    }),
  });

  return NextResponse.json({ response: "ok" });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { token: string } }
) {
  const body = await req.json();

  const { token } = params;

  const user = await prisma.credentials.findFirst({
    where: {
      ResetToken: {
        some: {
          AND: [
            {
              resetAt: null,
            },
            {
              createdAt: {
                gt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 24 hours ago
              },
            },
            {
              token,
            },
          ],
        },
      },
    },
  });

  if (!user) {
    return NextResponse.json({ response: "bad" });
  }

  const password = await hash(body.password, 12);

  await prisma.credentials.update({
    where: {
      id: user.id,
    },
    data: {
      password: password,
    },
  });

  await prisma.resetToken.update({
    where: {
      token,
    },
    data: {
      resetAt: new Date(),
    },
  });

  return NextResponse.json({ response: "ok" });
}
