import { NextResponse } from "next/server";
import { applyToJobPrisma } from "@/lib/prisma/jobs";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { UserSession } from "@/types";

export async function POST(req: Request) {
  const session = (await getServerSession(authOptions)) as UserSession;

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  await applyToJobPrisma(body.jobId, session.user.uid);
  return NextResponse.json({ response: "Applied To Job" });
}
