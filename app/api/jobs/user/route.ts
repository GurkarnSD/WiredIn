import { NextResponse } from "next/server";
import { getMyJobsPrisma } from "@/lib/prisma/jobs";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { UserSession } from "@/types";

export async function GET(req: Request) {
  const session = (await getServerSession(authOptions)) as UserSession;

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const uid = session.user.uid;
  const res = await getMyJobsPrisma(uid);
  return NextResponse.json(res);
}
