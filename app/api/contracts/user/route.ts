import { NextResponse } from "next/server";
import { getMyContractsPrisma } from "@/lib/prisma/contracts";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { UserSession } from "@/types";

export async function GET(req: Request) {
  const session = (await getServerSession(authOptions)) as UserSession;

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const uid = session.user.uid;
  const res = await getMyContractsPrisma(uid);
  return NextResponse.json(res);
}
