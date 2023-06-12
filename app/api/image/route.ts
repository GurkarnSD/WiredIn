import { NextResponse } from "next/server";
import imageUpload from "@/lib/aws/image";

export async function POST(req: Request) {
  const body = await req.formData();
  const imageFile = body.get("image") as File;

  const { url, key } = await imageUpload(imageFile);

  const contentType = imageFile.type;

  await fetch(url, {
    method: "PUT",
    body: imageFile,
    headers: {
      "Content-Type": contentType,
    },
  });

  return NextResponse.json({ url, key });
}
