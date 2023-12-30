import { NextResponse } from "next/server";
import {
  getChatRoomsPrisma,
  findChatRoomPrisma,
  deleteChatRoomPrisma,
} from "@/lib/prisma/chatRooms";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const res = await getChatRoomsPrisma(id as string);

  return NextResponse.json(res);
}

export async function POST(req: Request) {
  const body = await req.json();
  const { userId1, userId2 } = body;
  const res = await findChatRoomPrisma(userId1, userId2);

  return NextResponse.json(res);
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const res = await deleteChatRoomPrisma(id as string);

  return NextResponse.json({ response: "Deleted ChatRoom" });
}
