import { NextResponse } from "next/server";
import {
  getExperiencesPrisma,
  createExperiencePrisma,
  updateExperiencePrisma,
  deleteExperiencePrisma,
} from "@/lib/prisma/experiences";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { UserSession } from "@/types";

export async function GET(req: Request) {
  const session = (await getServerSession(authOptions)) as UserSession;

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const uid = searchParams.get("uid");
  const res = await getExperiencesPrisma(uid as string);

  return NextResponse.json(res);
}

export async function POST(req: Request) {
  const session = (await getServerSession(authOptions)) as UserSession;

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  await createExperiencePrisma(session.user.uid, body.experience);

  return NextResponse.json({ response: "Created Experience" });
}

export async function PUT(req: Request) {
  const session = (await getServerSession(authOptions)) as UserSession;

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  await updateExperiencePrisma(session.user.uid, body.experience);

  return NextResponse.json({ response: "Updated Experience" });
}

export async function DELETE(req: Request) {
  const session = (await getServerSession(authOptions)) as UserSession;

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  await deleteExperiencePrisma(session.user.uid, id as string);

  return NextResponse.json({ response: "Deleted Experience" });
}
