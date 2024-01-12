import { NextResponse } from "next/server";
import { getTagOptionsPrisma } from "@/lib/prisma/contracts";

export async function GET(req: Request) {
  const res = await getTagOptionsPrisma();
  return NextResponse.json(res);
}
