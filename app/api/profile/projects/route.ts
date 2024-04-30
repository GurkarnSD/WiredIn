import { NextResponse } from "next/server";
import {
  getProjectsPrisma,
  createProjectPrisma,
  updateProjectPrisma,
  deleteProjectPrisma,
} from "@/lib/prisma/projects";
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
  const res = await getProjectsPrisma(uid as string);

  return NextResponse.json(res);
}

export async function POST(req: Request) {
  const session = (await getServerSession(authOptions)) as UserSession;

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  await createProjectPrisma(session.user.uid, body.project);

  return NextResponse.json({ response: "Created Project" });
}

export async function PUT(req: Request) {
  const session = (await getServerSession(authOptions)) as UserSession;

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  await updateProjectPrisma(session.user.uid, body.project);

  return NextResponse.json({ response: "Updated Project" });
}

export async function DELETE(req: Request) {
  const session = (await getServerSession(authOptions)) as UserSession;

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  await deleteProjectPrisma(session.user.uid, id as string);

  return NextResponse.json({ response: "Deleted Project" });
}
