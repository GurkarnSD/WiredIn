import { NextRequest, NextResponse } from "next/server";
import { searchContractsPrisma } from "@/lib/prisma/contracts";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const userId = searchParams.get("uid");
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
