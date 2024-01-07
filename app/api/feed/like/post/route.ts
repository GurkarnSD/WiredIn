import { NextResponse } from "next/server";
import { likePostPrisma, unlikePostPrisma } from "@/lib/prisma/posts";

export async function POST(req: Request) {
  const body = await req.json();
  await likePostPrisma(body.uid, body.postId);

  return NextResponse.json({ response: "Liked Post" });
}

export async function DELETE(req: Request) {
  const body = await req.json();
  await unlikePostPrisma(body.uid, body.postId);

  return NextResponse.json({ response: "Unliked Post" });
}
