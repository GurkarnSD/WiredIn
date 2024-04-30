import { NextResponse } from "next/server";
import imageUploadUrl from "@/lib/aws/image";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { UserSession } from "@/types";

export async function POST(req: Request) {
  const session = (await getServerSession(authOptions)) as UserSession;

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const uid = session.user.uid;
  const body = await req.formData();
  const imageFile = body.get("image") as File;
  const type = body.get("type") as string;

  const { url, key } = await imageUploadUrl(uid, type);

  const contentType = imageFile.type;

  if (!url) {
    throw new Error("Failed to generate image upload URL");
  }

  await fetch(url, {
    method: "PUT",
    body: imageFile,
    headers: {
      "Content-Type": contentType,
    },
  });

  return NextResponse.json({ key });
}
