import { NextResponse } from "next/server";
import { getTagOptionsPrisma } from "@/lib/prisma/utilities";

export async function GET(req: Request) {
  const res = await getTagOptionsPrisma();
  return NextResponse.json(res);
}
