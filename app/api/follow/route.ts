import { NextResponse } from "next/server";
import { followUserMongo, unfollowUserMongo } from "@/lib/mongo/follow";

export async function POST(req: Request) {
  const body = await req.json();
  const res = await followUserMongo(body.user, body.otherUser);

  return NextResponse.json({ response: "Followed User" });
}

export async function PUT(req: Request) {
  const body = await req.json();
  const res = await unfollowUserMongo(body.user, body.otherUser);

  return NextResponse.json({ response: "Unfollowed User" });
}
