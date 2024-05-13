import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";
import { UserSession } from "@/types";
import { prisma } from "@/lib/prisma";

export async function DELETE(req: Request) {
  const session = (await getServerSession(authOptions)) as UserSession;

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = Number(searchParams.get("id"));

  if (!id) {
    return NextResponse.json({ error: "Missing ID" }, { status: 400 });
  }

  await prisma.session.delete({
    where: { id: id, credentialsId: session.user.uid },
  });

  return NextResponse.json({ response: "Deleted Contract" });
}
