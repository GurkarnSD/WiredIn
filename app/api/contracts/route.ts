import { NextRequest, NextResponse } from "next/server";
import {
  getContractsPrisma,
  createContractPrisma,
  updateContractPrisma,
  deleteContractPrisma,
} from "@/lib/prisma/contracts";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const userId = searchParams.get("uid");
  const page = Number(searchParams.get("page") || 1);
  const pageSize = Number(searchParams.get("pageSize") || 10);
  if (!userId) {
    return NextResponse.error();
  }
  const contracts = await getContractsPrisma(userId, page, pageSize);
  return NextResponse.json(contracts);
}

export async function POST(req: Request) {
  const body = await req.json();
  await createContractPrisma(body.userId, body.contract);
  return NextResponse.json({ response: "Created Contract" });
}

export async function PUT(req: Request) {
  const body = await req.json();
  await updateContractPrisma(body.contract);
  return NextResponse.json({ response: "Updated Contract" });
}

export async function DELETE(req: Request) {
  const body = await req.json();
  await deleteContractPrisma(body.contractId);
  return NextResponse.json({ response: "Deleted Contract" });
}
