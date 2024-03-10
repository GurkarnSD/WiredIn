import { NextRequest, NextResponse } from "next/server";
import {
  checkFollowing,
  followUserPrisma,
  unfollowUserPrisma,
} from "@/lib/prisma/follow";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const user = searchParams.get("user");
  const otherUser = searchParams.get("otherUser");
  if (user === null || otherUser === null) {
    return NextResponse.error();
  }
  const checkReturn = await checkFollowing(user, otherUser);

  return NextResponse.json({ response: checkReturn });
}

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
