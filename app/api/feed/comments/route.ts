import { NextResponse } from "next/server";
import {
  getCommentsPrisma,
  createCommentPrisma,
  deleteCommentPrisma,
} from "@/lib/prisma/comments";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const uid = searchParams.get("uid");
  const res = await getCommentsPrisma(uid as string);

  return NextResponse.json(res);
}

export async function POST(req: Request) {
  const body = await req.json();
  const res = await createCommentPrisma(body.uid, body.postId, body.text);

  return NextResponse.json({ response: "Created Post" });
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("uid");
  const res = await deleteCommentPrisma(id as string);

  return NextResponse.json({ response: "Deleted Post" });
}
