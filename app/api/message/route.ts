import { NextResponse } from "next/server";
import { pusherServer } from "@/lib/pusher";
import {
  getMessagesPrisma,
  createMessagePrisma,
  deleteMessagePrisma,
} from "@/lib/prisma/messages";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const uid = searchParams.get("chatRoomId");
  const res = await getMessagesPrisma(uid as string);

  return NextResponse.json(res);
}

export async function POST(req: Request) {
  const body = await req.json();
  const { chatRoomId, senderId, message, attachments } = body;

  const res = await createMessagePrisma(
    chatRoomId,
    senderId,
    message,
    attachments
  );

  await pusherServer.trigger(`presence-${chatRoomId}`, "incoming-message", res);

  return NextResponse.json({ response: "Message Sent" });
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = Number(searchParams.get("id"));
  await deleteMessagePrisma(id);

  return NextResponse.json({ response: "Deleted Message" });
}
