import { NextRequest, NextResponse } from "next/server";
import { searchJobsPrisma } from "@/lib/prisma/jobs";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const userId = searchParams.get("uid");
  const page = Number(searchParams.get("page") || 1);
  const pageSize = Number(searchParams.get("pageSize") || 10);
  const title = searchParams.get("title");
  if (!userId || !title) {
    return NextResponse.error();
  }
  const jobs = await searchJobsPrisma(userId, page, pageSize, title);
  return NextResponse.json(jobs);
}
