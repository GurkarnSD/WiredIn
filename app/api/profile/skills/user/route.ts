import { NextResponse } from "next/server";
import {
  getSkillsPrisma,
  addSkillPrisma,
  deleteSkillPrisma,
} from "@/lib/prisma/skills";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";
import { UserSession } from "@/types";

export async function GET(req: Request) {
  const session = (await getServerSession(authOptions)) as UserSession;

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const uid = searchParams.get("uid");
  const res = await getSkillsPrisma(uid as string);

  return NextResponse.json(res);
}

export async function POST(req: Request) {
  const session = (await getServerSession(authOptions)) as UserSession;

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  await addSkillPrisma(session.user.uid, body.skill);

  return NextResponse.json({ response: "Added Skill" });
}

export async function DELETE(req: Request) {
  const session = (await getServerSession(authOptions)) as UserSession;

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  await deleteSkillPrisma(session.user.uid, id as string);

  return NextResponse.json({ response: "Deleted Skill" });
}
