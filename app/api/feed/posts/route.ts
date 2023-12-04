import { NextResponse } from "next/server";
import {
  getPostsPrisma,
  createPostPrisma,
  deletePostPrisma,
} from "@/lib/prisma/posts";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const uid = searchParams.get("uid");
  const res = await getPostsPrisma(uid as string);

  return NextResponse.json(res);
}

export async function POST(req: Request) {
  const body = await req.json();
  const res = await createPostPrisma(body.uid, body.post);

  return NextResponse.json({ response: "Created Post" });
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const res = await deletePostPrisma(id as string);

  return NextResponse.json({ response: "Deleted Post" });
}
