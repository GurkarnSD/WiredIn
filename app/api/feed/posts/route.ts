import { NextRequest, NextResponse } from "next/server";
import {
  getPostsPrisma,
  createPostPrisma,
  deletePostPrisma,
} from "@/lib/prisma/posts";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const uid = searchParams.get("uid");
  const page = Number(searchParams.get("page") || 1);
  const pageSize = Number(searchParams.get("pageSize") || 10);
  const res = await getPostsPrisma(uid as string, page, pageSize);

  return NextResponse.json(res);
}

export async function POST(req: Request) {
  const body = await req.json();
  await createPostPrisma(body.uid, body.post);

  return NextResponse.json({ response: "Created Post" });
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const uid = searchParams.get("uid");
  await deletePostPrisma(uid as string);

  return NextResponse.json({ response: "Deleted Post" });
}
