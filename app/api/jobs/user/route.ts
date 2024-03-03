import { NextResponse } from "next/server";
import { getMyJobsPrisma } from "@/lib/prisma/jobs";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const uid = searchParams.get("uid");
  const res = await getMyJobsPrisma(uid as string);
  return NextResponse.json(res);
}
