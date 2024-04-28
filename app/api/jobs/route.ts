import { NextRequest, NextResponse } from "next/server";
import {
  getJobsPrisma,
  createJobPrisma,
  updateJobPrisma,
  deleteJobPrisma,
} from "@/lib/prisma/jobs";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const userId = searchParams.get("uid");
  const page = Number(searchParams.get("page") || 1);
  const pageSize = Number(searchParams.get("pageSize") || 10);
  if (!userId) {
    return NextResponse.error();
  }
  const jobs = await getJobsPrisma(userId, page, pageSize);
  return NextResponse.json(jobs);
}

export async function POST(req: Request) {
  const body = await req.json();
  await createJobPrisma(body.userId, body.job);
  return NextResponse.json({ response: "Created Job" });
}

export async function PUT(req: Request) {
  const body = await req.json();
  await updateJobPrisma(body.job);
  return NextResponse.json({ response: "Updated Job" });
}

export async function DELETE(req: Request) {
  const body = await req.json();
  await deleteJobPrisma(body.jobId);
  return NextResponse.json({ response: "Deleted Job" });
}
