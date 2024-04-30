import { NextResponse } from "next/server";
import { pusherServer } from "@/lib/pusher";
import {
  getMessagesPrisma,
  createMessagePrisma,
  deleteMessagePrisma,
} from "@/lib/prisma/messages";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { UserSession } from "@/types";

export async function GET(req: Request) {
  const session = (await getServerSession(authOptions)) as UserSession;

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const uid = searchParams.get("chatRoomId");
  const res = await getMessagesPrisma(session.user.uid, uid as string);

  return NextResponse.json(res);
}

export async function POST(req: Request) {
  const session = (await getServerSession(authOptions)) as UserSession;

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { chatRoomId, message, attachments } = body;

  const res = await createMessagePrisma(
    chatRoomId,
    session.user.uid,
    message,
    attachments
  );

  await pusherServer.trigger(`presence-${chatRoomId}`, "incoming-message", res);

  return NextResponse.json({ response: "Message Sent" });
}

export async function DELETE(req: Request) {
  const session = (await getServerSession(authOptions)) as UserSession;

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = Number(searchParams.get("id"));
  await deleteMessagePrisma(session.user.uid, id);

  return NextResponse.json({ response: "Deleted Message" });
}
