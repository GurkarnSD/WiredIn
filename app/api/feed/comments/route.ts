import { NextResponse } from "next/server";
import {
  getCommentsPrisma,
  createCommentPrisma,
  updateCommentPrisma,
  deleteCommentPrisma,
} from "@/lib/prisma/comments";
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
  const res = await getCommentsPrisma(uid as string);

  return NextResponse.json(res);
}

export async function POST(req: Request) {
  const session = (await getServerSession(authOptions)) as UserSession;

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  await createCommentPrisma(session.user.uid, body.postId, body.text);

  return NextResponse.json({ response: "Created Comment" });
}

export async function PUT(req: Request) {
  const session = (await getServerSession(authOptions)) as UserSession;

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  await updateCommentPrisma(session.user.uid, body.commentId, body.text);

  return NextResponse.json({ response: "Created Comment" });
}

export async function DELETE(req: Request) {
  const session = (await getServerSession(authOptions)) as UserSession;

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = Number(searchParams.get("id"));
  await deleteCommentPrisma(session.user.uid, id);

  return NextResponse.json({ response: "Deleted Comment" });
}
