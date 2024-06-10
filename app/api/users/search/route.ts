import { NextResponse } from "next/server";
import { searchUsersPrisma } from "../../../../lib/prisma/users";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { UserSession } from "@/types";

export async function GET(req: Request) {
  const session = (await getServerSession(authOptions)) as UserSession;

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query");
  const res = await searchUsersPrisma(session.user.uid, query as string);

  return NextResponse.json(res);
}
