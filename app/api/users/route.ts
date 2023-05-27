import { NextResponse } from "next/server";
import { getUserMongo } from "../../../lib/mongo/user";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const uid = searchParams.get("uid");
  const name = searchParams.get("name");

  var res = {};

  if (uid) {
    res = await getUserMongo(uid as string, '');
  } else if (name) {
    res = await getUserMongo('', name as string);
  }

  return NextResponse.json(res);
}
