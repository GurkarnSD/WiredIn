import { NextRequest, NextResponse } from "next/server";
import { getUserPresignedUrl } from "@/lib/aws/image";

export async function GET(
  req: NextRequest,
  { params }: { params: { user: string; image: string } }
) {
  const { user, image } = params;

  const { url, error } = await getUserPresignedUrl(user + "/" + image);

  if (error) return NextResponse.json({ error });

  return NextResponse.json({ url });
}
