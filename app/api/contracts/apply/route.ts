import { NextResponse } from "next/server";
import { applyToContractPrisma } from "@/lib/prisma/contracts";

export async function POST(req: Request) {
  const body = await req.json();
  await applyToContractPrisma(body.contractId, body.userId);
  return NextResponse.json({ response: "Applied To Contract" });
}
