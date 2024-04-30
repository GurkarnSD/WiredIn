import { NextRequest, NextResponse } from "next/server";
import {
  getJobsPrisma,
  createJobPrisma,
  updateJobPrisma,
  deleteJobPrisma,
} from "@/lib/prisma/jobs";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { UserSession } from "@/types";

export async function GET(req: NextRequest) {
  const session = (await getServerSession(authOptions)) as UserSession;

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.uid;
  const searchParams = req.nextUrl.searchParams;
  const page = Number(searchParams.get("page") || 1);
  const pageSize = Number(searchParams.get("pageSize") || 10);
  if (!userId) {
    return NextResponse.error();
  }
  const jobs = await getJobsPrisma(userId, page, pageSize);
  return NextResponse.json(jobs);
}

export async function POST(req: Request) {
  const session = (await getServerSession(authOptions)) as UserSession;

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  await createJobPrisma(session.user.uid, body.job);
  return NextResponse.json({ response: "Created Job" });
}

export async function PUT(req: Request) {
  const session = (await getServerSession(authOptions)) as UserSession;

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  await updateJobPrisma(session.user.uid, body.job);
  return NextResponse.json({ response: "Updated Job" });
}

export async function DELETE(req: Request) {
  const session = (await getServerSession(authOptions)) as UserSession;

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  await deleteJobPrisma(session.user.uid, body.jobId);
  return NextResponse.json({ response: "Deleted Job" });
}
