import { NextResponse } from "next/server";
import { getTagOptionsPrisma } from "@/lib/prisma/utilities";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { UserSession } from "@/types";

export async function GET(req: Request) {
  const session = (await getServerSession(authOptions)) as UserSession;

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const res = await getTagOptionsPrisma();
  return NextResponse.json(res);
}
