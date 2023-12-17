import { NextResponse } from "next/server";
import imageUploadUrl from "@/lib/aws/image";

export async function POST(req: Request) {
  const body = await req.formData();
  const imageFile = body.get("image") as File;
  const uid = body.get("uid") as string;
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
