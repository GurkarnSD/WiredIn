import { NextResponse } from "next/server";
import {
  getExperiencesPrisma,
  createExperiencePrisma,
  deleteExperiencePrisma,
} from "@/lib/prisma/experiences";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const uid = searchParams.get("uid");
  const res = await getExperiencesPrisma(uid as string);

  return NextResponse.json(res);
}

export async function POST(req: Request) {
  const body = await req.json();
  await createExperiencePrisma(body.uid, body.experience);

  return NextResponse.json({ response: "Created Experience" });
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  await deleteExperiencePrisma(id as string);

  return NextResponse.json({ response: "Deleted Experience" });
}
