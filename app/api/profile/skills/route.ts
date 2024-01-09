import { NextResponse } from "next/server";
import { getSkillOptionsPrisma } from "@/lib/prisma/skills";

export async function GET(req: Request) {
  const res = await getSkillOptionsPrisma();
  return NextResponse.json(res);
}
