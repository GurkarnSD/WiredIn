import { NextResponse } from "next/server";
import {
  getResponsesPrisma,
  createResponsePrisma,
  updateResponsePrisma,
  deleteResponsePrisma,
} from "@/lib/prisma/responses";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { UserSession } from "@/types";

export async function GET(req: Request) {
  const session = (await getServerSession(authOptions)) as UserSession;

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const commentId = Number(searchParams.get("id"));
  const res = await getResponsesPrisma(commentId);

  return NextResponse.json(res);
}

export async function POST(req: Request) {
  const session = (await getServerSession(authOptions)) as UserSession;

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  await createResponsePrisma(session.user.uid, body.commentId, body.text);

  return NextResponse.json({ response: "Created Response" });
}

export async function PUT(req: Request) {
  const session = (await getServerSession(authOptions)) as UserSession;

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  await updateResponsePrisma(session.user.uid, body.responseId, body.text);

  return NextResponse.json({ response: "Updated Response" });
}

export async function DELETE(req: Request) {
  const session = (await getServerSession(authOptions)) as UserSession;

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = Number(searchParams.get("id"));
  await deleteResponsePrisma(session.user.uid, id);

  return NextResponse.json({ response: "Deleted Response" });
}
