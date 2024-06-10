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
  const titleParam = searchParams.get("title");
  const title = titleParam ? decodeURIComponent(titleParam) : "";
  const skillsParam = searchParams.get("skills");
  const skills = skillsParam ? decodeURIComponent(skillsParam).split(",") : [];
  const tagsParam = searchParams.get("tags");
  const tags = tagsParam ? decodeURIComponent(tagsParam).split(",") : [];

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
