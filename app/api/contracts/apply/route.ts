import { NextResponse } from "next/server";
import { applyToContractPrisma } from "@/lib/prisma/contracts";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { UserSession } from "@/types";

export async function POST(req: Request) {
  const session = (await getServerSession(authOptions)) as UserSession;

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  await applyToContractPrisma(body.contractId, session.user.uid);
  return NextResponse.json({ response: "Applied To Contract" });
}
