import { NextResponse } from "next/server";
import { followUserPrisma, unfollowUserPrisma } from "@/lib/prisma/follow";

export async function POST(req: Request) {
  const body = await req.json();
  await followUserPrisma(body.user, body.otherUser);

  return NextResponse.json({ response: "Followed User" });
}

export async function PUT(req: Request) {
  const body = await req.json();
  await unfollowUserPrisma(body.user, body.otherUser);

  return NextResponse.json({ response: "Unfollowed User" });
}
