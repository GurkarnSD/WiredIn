import { NextResponse } from "next/server";
import { likeCommentPrisma, unlikeCommentPrisma } from "@/lib/prisma/comments";

export async function POST(req: Request) {
  const body = await req.json();
  await likeCommentPrisma(body.uid, body.commentId);

  return NextResponse.json({ response: "Liked Comment" });
}

export async function DELETE(req: Request) {
  const body = await req.json();
  await unlikeCommentPrisma(body.uid, body.commentId);

  return NextResponse.json({ response: "Unliked Comment" });
}
