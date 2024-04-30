import { NextResponse } from "next/server";
import {
  likeResponsePrisma,
  unlikeResponsePrisma,
} from "@/lib/prisma/responses";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { UserSession } from "@/types";

export async function POST(req: Request) {
  const session = (await getServerSession(authOptions)) as UserSession;

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  await likeResponsePrisma(session.user.uid, body.responseId);

  return NextResponse.json({ response: "Liked Response" });
}

export async function DELETE(req: Request) {
  const session = (await getServerSession(authOptions)) as UserSession;

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  await unlikeResponsePrisma(session.user.uid, body.responseId);

  return NextResponse.json({ response: "Unliked Response" });
}
