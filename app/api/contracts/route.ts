import { NextRequest, NextResponse } from "next/server";
import {
  getContractsPrisma,
  createContractPrisma,
  updateContractPrisma,
  deleteContractPrisma,
} from "@/lib/prisma/contracts";
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
  const contracts = await getContractsPrisma(userId, page, pageSize);
  return NextResponse.json(contracts);
}

export async function POST(req: Request) {
  const session = (await getServerSession(authOptions)) as UserSession;

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  await createContractPrisma(session.user.uid, body.contract);
  return NextResponse.json({ response: "Created Contract" });
}

export async function PUT(req: Request) {
  const session = (await getServerSession(authOptions)) as UserSession;

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  await updateContractPrisma(session.user.uid, body.contract);
  return NextResponse.json({ response: "Updated Contract" });
}

export async function DELETE(req: Request) {
  const session = (await getServerSession(authOptions)) as UserSession;

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  await deleteContractPrisma(session.user.uid, body.contractId);
  return NextResponse.json({ response: "Deleted Contract" });
}
