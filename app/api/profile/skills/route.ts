import { NextResponse } from "next/server";
import { getSkillOptionsPrisma } from "@/lib/prisma/skills";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { UserSession } from "@/types";

export async function GET(req: Request) {
  const session = (await getServerSession(authOptions)) as UserSession;

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const res = await getSkillOptionsPrisma();
  return NextResponse.json(res);
}
