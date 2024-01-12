import { NextResponse } from "next/server";
import { getMyContractsPrisma } from "@/lib/prisma/contracts";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const uid = searchParams.get("uid");
  const res = await getMyContractsPrisma(uid as string);
  return NextResponse.json(res);
}
