import { NextResponse } from "next/server";
import { applyToJobPrisma } from "@/lib/prisma/jobs";

export async function POST(req: Request) {
  const body = await req.json();
  await applyToJobPrisma(body.jobId, body.userId);
  return NextResponse.json({ response: "Applied To Job" });
}
