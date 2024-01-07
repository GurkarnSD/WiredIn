import { NextResponse } from "next/server";
import {
  likeResponsePrisma,
  unlikeResponsePrisma,
} from "@/lib/prisma/responses";

export async function POST(req: Request) {
  const body = await req.json();
  await likeResponsePrisma(body.uid, body.responseId);

  return NextResponse.json({ response: "Liked Response" });
}

export async function DELETE(req: Request) {
  const body = await req.json();
  await unlikeResponsePrisma(body.uid, body.responseId);

  return NextResponse.json({ response: "Unliked Response" });
}
