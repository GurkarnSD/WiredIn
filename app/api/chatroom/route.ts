import { NextResponse } from "next/server";
import {
  getChatRoomsPrisma,
  findChatRoomPrisma,
  deleteChatRoomPrisma,
} from "@/lib/prisma/chatRooms";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { UserSession } from "@/types";

export async function GET(req: Request) {
  const session = (await getServerSession(authOptions)) as UserSession;

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const res = await getChatRoomsPrisma(session.user.uid);

  return NextResponse.json(res);
}

export async function POST(req: Request) {
  const session = (await getServerSession(authOptions)) as UserSession;

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = session.user.uid;
  const body = await req.json();
  const otherUser = body.otherUser;
  const res = await findChatRoomPrisma(user, otherUser);

  return NextResponse.json(res);
}

export async function DELETE(req: Request) {
  const session = (await getServerSession(authOptions)) as UserSession;

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  await deleteChatRoomPrisma(session.user.uid, id as string);

  return NextResponse.json({ response: "Deleted ChatRoom" });
}
