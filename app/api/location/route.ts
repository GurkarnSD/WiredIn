import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const ip = searchParams.get("ip");
  const location = searchParams.get("location");

  if (process.env.NODE_ENV !== "production") {
    return NextResponse.json({
      ipAddress: "Localhost",
      location: "Developer, Environment, Computer",
    });
  }

  return NextResponse.json({ ipAddress: ip, location });
}
