import { NextResponse } from "next/server";
import {
  getResponsesPrisma,
  createResponsePrisma,
  deleteResponsePrisma,
} from "@/lib/prisma/responses";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const commentId = Number(searchParams.get("id"));
  const res = await getResponsesPrisma(commentId);

  return NextResponse.json(res);
}

export async function POST(req: Request) {
  const body = await req.json();
  await createResponsePrisma(body.uid, body.commentId, body.text);

  return NextResponse.json({ response: "Created Response" });
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = Number(searchParams.get("id"));
  await deleteResponsePrisma(id);

  return NextResponse.json({ response: "Deleted Response" });
}
