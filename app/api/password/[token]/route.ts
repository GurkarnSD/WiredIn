import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma/index";
import { hash } from "bcrypt";
import { randomUUID } from "crypto";

export async function POST(
  req: NextRequest,
  { params }: { params: { token: string } }
) {
  const body = await req.json();

  const user = await prisma.credentials.findFirst({
    where: { email: body.email },
  });

  if (!user) {
    // Return Early
    return NextResponse.json({ response: "ok" });
  }

  const token = await prisma.resetToken.create({
    data: {
      token: `${randomUUID()}${randomUUID()}`.replace(/-/g, ""),
      credsId: user.id,
    },
  });

  await fetch(`${process.env.API_URL}/api/send/reset`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: user.email,
      token: token.token,
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
