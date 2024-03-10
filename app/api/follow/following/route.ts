import { NextRequest, NextResponse } from "next/server";
import { getFollowing } from "@/lib/prisma/follow";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const user = searchParams.get("user");
  const sessionUser = searchParams.get("session");
  if (user === null || sessionUser === null) {
    return NextResponse.error();
  }
  const following = await getFollowing(user, sessionUser);

  return NextResponse.json({ response: following });
}
