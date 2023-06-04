import { NextResponse } from "next/server";
import { createUserPrisma, getUserPrisma } from "../../../lib/prisma/user";
import { hash } from "bcrypt";

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

export async function POST(req: Request) {
  const body = await req.json();
  const password = await hash(body.password, 12);

  await createUserPrisma({
    email: body.email,
    password,
    displayName: body.username,
  });

  return NextResponse.json({ response: "ok" });
}
