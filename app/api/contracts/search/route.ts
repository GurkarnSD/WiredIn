import { NextRequest, NextResponse } from "next/server";
import { searchContractsPrisma } from "@/lib/prisma/contracts";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { UserSession } from "@/types";

export async function GET(req: NextRequest) {
  const session = (await getServerSession(authOptions)) as UserSession;

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.uid;
  const searchParams = req.nextUrl.searchParams;
  const page = Number(searchParams.get("page") || 1);
  const pageSize = Number(searchParams.get("pageSize") || 10);
  const title = searchParams.get("title") || "";
  const skills = searchParams.get("skills")?.split(",") || [];
  const tags = searchParams.get("tags")?.split(",") || [];
  if (!userId) {
    return NextResponse.error();
  }
  const contracts = await searchContractsPrisma(
    userId,
    page,
    pageSize,
    title,
    skills,
    tags
  );
  return NextResponse.json(contracts);
}
