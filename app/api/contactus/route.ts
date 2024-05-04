import { NextResponse } from "next/server";
import { uploadContactFormPrisma } from "@/lib/prisma/contact";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { UserSession } from "@/types";

export async function POST(req: Request) {
  const session = (await getServerSession(authOptions)) as UserSession;

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  await uploadContactFormPrisma(session.user.uid, body.contactForm);
  return NextResponse.json({ response: "Uploaded Contact Form" });
}
