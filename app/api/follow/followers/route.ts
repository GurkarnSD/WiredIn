import { NextRequest, NextResponse } from "next/server";
import { getFollowers } from "@/lib/prisma/follow";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const user = searchParams.get("user");
  const sessionUser = searchParams.get("session");
  if (user === null || sessionUser === null) {
    return NextResponse.error();
  }
  const followers = await getFollowers(user, sessionUser);

  return NextResponse.json({ response: followers });
}
