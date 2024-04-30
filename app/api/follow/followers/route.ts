import { NextRequest, NextResponse } from "next/server";
import { getFollowers } from "@/lib/prisma/follow";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { UserSession } from "@/types";

export async function GET(req: NextRequest) {
  const session = (await getServerSession(authOptions)) as UserSession;

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sessionUser = session.user.uid;
  const searchParams = req.nextUrl.searchParams;
  const user = searchParams.get("user");
  if (user === null) {
    return NextResponse.error();
  }
  const followers = await getFollowers(user, sessionUser);

  return NextResponse.json({ response: followers });
}
