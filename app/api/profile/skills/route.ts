import { NextResponse } from "next/server";
import {
  getSkillsPrisma,
  addSkillPrisma,
  deleteSkillPrisma,
} from "@/lib/prisma/skills";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const uid = searchParams.get("uid");
  const res = await getSkillsPrisma(uid as string);

  return NextResponse.json(res);
}

export async function POST(req: Request) {
  const body = await req.json();
  const res = await addSkillPrisma(body.user, body.skill);

  return NextResponse.json({ response: "Added Skill" });
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const res = await deleteSkillPrisma(id as string);

  return NextResponse.json({ response: "Deleted Skill" });
}
