import { NextResponse } from "next/server";
import {
  createUserPrisma,
  getUserPrisma,
  updateUserPrisma,
} from "../../../lib/prisma/user";
import { hash } from "bcrypt";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const uid = searchParams.get("uid");
  const name = searchParams.get("name");

  let res = {};

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

  try {
    await createUserPrisma({
      email: body.email,
      password,
      displayName: body.username,
    });
  } catch (error: any) {
    if (error.message === "EMAIL_IN_USE") {
      return NextResponse.json(
        { error: "Email is already in use. Please choose another email." },
        { status: 400 }
      );
    } else if (error.message === "DISPLAY_NAME_IN_USE") {
      return NextResponse.json(
        {
          error:
            "Display name is already in use. Please choose another display name.",
        },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Unable to create user." },
      { status: 500 }
    );
  }

  return NextResponse.json({ response: "ok" });
}

export async function PUT(req: Request) {
  const body = await req.json();

  await updateUserPrisma(body);

  return NextResponse.json({ response: "ok" });
}
