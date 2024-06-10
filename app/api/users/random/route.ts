import { NextResponse } from "next/server";
import { getRandomUsersPrisma } from "../../../../lib/prisma/users";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const uid = searchParams.get("uid");
  const res = await getRandomUsersPrisma(uid as string);

  return NextResponse.json(res);
}
