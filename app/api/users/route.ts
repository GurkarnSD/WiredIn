import { NextResponse } from "next/server";
import { getUserPrisma } from "../../../lib/prisma/user";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const uid = searchParams.get("uid");
  const name = searchParams.get("name");

  var res = {};

  if (uid) {
    res = await getUserPrisma(uid as string, "");
  } else if (name) {
    res = await getUserPrisma("", name as string);
  }

  return NextResponse.json(res);
}
