import { NextRequest, NextResponse } from "next/server";
import {
  getPostsPrisma,
  createPostPrisma,
  updatePostPrisma,
  deletePostPrisma,
} from "@/lib/prisma/posts";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { UserSession } from "@/types";

export async function GET(req: NextRequest) {
  const session = (await getServerSession(authOptions)) as UserSession;

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const uid = session.user.uid;
  const searchParams = req.nextUrl.searchParams;
  const page = Number(searchParams.get("page") || 1);
  const pageSize = Number(searchParams.get("pageSize") || 10);
  const res = await getPostsPrisma(uid as string, page, pageSize);

  return NextResponse.json(res);
}

export async function POST(req: Request) {
  const session = (await getServerSession(authOptions)) as UserSession;

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  await createPostPrisma(session.user.uid, body.post);

  return NextResponse.json({ response: "Created Post" });
}

export async function PUT(req: Request) {
  const session = (await getServerSession(authOptions)) as UserSession;

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  await updatePostPrisma(session.user.uid, body.post);

  return NextResponse.json({ response: "Updated Post" });
}

export async function DELETE(req: Request) {
  const session = (await getServerSession(authOptions)) as UserSession;

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const uid = searchParams.get("uid");
  await deletePostPrisma(session.user.uid, uid as string);

  return NextResponse.json({ response: "Deleted Post" });
}
