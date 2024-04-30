import { NextResponse } from "next/server";
import { likeCommentPrisma, unlikeCommentPrisma } from "@/lib/prisma/comments";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { UserSession } from "@/types";

export async function POST(req: Request) {
  const session = (await getServerSession(authOptions)) as UserSession;

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  await likeCommentPrisma(session.user.uid, body.commentId);

  return NextResponse.json({ response: "Liked Comment" });
}

export async function DELETE(req: Request) {
  const session = (await getServerSession(authOptions)) as UserSession;

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  await unlikeCommentPrisma(session.user.uid, body.commentId);

  return NextResponse.json({ response: "Unliked Comment" });
}
