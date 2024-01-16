import { NextResponse } from "next/server";
import {
  checkLastNameChangePrisma,
  checkDisplayNamePrisma,
  changeDisplayNamePrisma,
} from "@/lib/prisma/user";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get("username");
  const nameChange = searchParams.get("nameChange");

  if (!username && !nameChange) {
    return NextResponse.json({
      error: "No username or nameChange request provided",
    });
  }

  let res;
  if (username && !nameChange) {
    res = await checkDisplayNamePrisma(username);
  } else if (username && nameChange === "true") {
    res = await checkLastNameChangePrisma(username);
  } else {
    return NextResponse.json({
      error: "Both username and nameChange are required for last name change",
    });
  }

  return NextResponse.json({ available: res });
}

export async function POST(req: Request) {
  const body = await req.json();
  const { username, newUsername } = body;

  if (!username || !newUsername) {
    return NextResponse.json({ error: "No username provided" });
  }

  await changeDisplayNamePrisma(username, newUsername);

  return NextResponse.json({ response: "Username changed" });
}
