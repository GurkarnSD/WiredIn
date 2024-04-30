import { NextResponse } from "next/server";
import { likePostPrisma, unlikePostPrisma } from "@/lib/prisma/posts";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { UserSession } from "@/types";

export async function POST(req: Request) {
  const session = (await getServerSession(authOptions)) as UserSession;

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  await likePostPrisma(session.user.uid, body.postId);

  return NextResponse.json({ response: "Liked Post" });
}

export async function DELETE(req: Request) {
  const session = (await getServerSession(authOptions)) as UserSession;

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  await unlikePostPrisma(session.user.uid, body.postId);

  return NextResponse.json({ response: "Unliked Post" });
}
