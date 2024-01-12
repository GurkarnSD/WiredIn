import { NextResponse } from "next/server";
import {
  createContractPrisma,
  deleteContractPrisma,
} from "@/lib/prisma/contracts";

export async function POST(req: Request) {
  const body = await req.json();
  await createContractPrisma(body.userId, body.contract);
  return NextResponse.json({ response: "Created Contract" });
}

export async function DELETE(req: Request) {
  const body = await req.json();
  await deleteContractPrisma(body.contractId);
  return NextResponse.json({ response: "Deleted Contract" });
}
