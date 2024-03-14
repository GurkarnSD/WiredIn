import { NextResponse } from "next/server";
import {
  getProjectsPrisma,
  createProjectPrisma,
  updateProjectPrisma,
  deleteProjectPrisma,
} from "@/lib/prisma/projects";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const uid = searchParams.get("uid");
  const res = await getProjectsPrisma(uid as string);

  return NextResponse.json(res);
}

export async function POST(req: Request) {
  const body = await req.json();
  await createProjectPrisma(body.uid, body.project);

  return NextResponse.json({ response: "Created Project" });
}

export async function PUT(req: Request) {
  const body = await req.json();
  await updateProjectPrisma(body.project);

  return NextResponse.json({ response: "Updated Project" });
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  await deleteProjectPrisma(id as string);

  return NextResponse.json({ response: "Deleted Project" });
}
