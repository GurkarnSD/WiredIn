import { NextRequest, NextResponse } from "next/server";
import {
  checkFollowing,
  followUserPrisma,
  unfollowUserPrisma,
} from "@/lib/prisma/follow";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { UserSession } from "@/types";

export async function GET(req: NextRequest) {
  const session = (await getServerSession(authOptions)) as UserSession;

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = session.user.uid;
  const searchParams = req.nextUrl.searchParams;
  const otherUser = searchParams.get("otherUser");
  if (otherUser === null) {
    return NextResponse.error();
  }
  const checkReturn = await checkFollowing(user, otherUser);

  return NextResponse.json({ response: checkReturn });
}

export async function POST(req: Request) {
  const session = (await getServerSession(authOptions)) as UserSession;

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  await followUserPrisma(session.user.uid, body.otherUser);

  return NextResponse.json({ response: "Followed User" });
}

export async function PUT(req: Request) {
  const session = (await getServerSession(authOptions)) as UserSession;

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  await unfollowUserPrisma(session.user.uid, body.otherUser);

  return NextResponse.json({ response: "Unfollowed User" });
}
