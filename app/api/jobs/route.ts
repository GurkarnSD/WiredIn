import { NextResponse } from "next/server";
import { createJobPrisma, deleteJobPrisma } from "@/lib/prisma/jobs";

export async function POST(req: Request) {
  const body = await req.json();
  await createJobPrisma(body.userId, body.job);
  return NextResponse.json({ response: "Created Job" });
}

export async function DELETE(req: Request) {
  const body = await req.json();
  await deleteJobPrisma(body.jobId);
  return NextResponse.json({ response: "Deleted Job" });
}
