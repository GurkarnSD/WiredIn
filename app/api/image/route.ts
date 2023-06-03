import { NextResponse } from "next/server";
import imageUpload from "@/lib/aws/image";
import axios from "axios";

export async function POST(req: Request) {
  const body = await req.formData();
  const imageFile = body.get("image") as File;

  const { url, key } = await imageUpload(imageFile);

  const formData = new FormData();
  formData.append("image", imageFile);

  await axios.put(url, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return NextResponse.json({ url, key });
}
