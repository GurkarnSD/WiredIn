import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const { nextUrl, geo, ip } = req;
  const location = geo.city + ", " + geo.region + ", " + geo.country;

  if (location) nextUrl.searchParams.set("location", location);
  if (ip) nextUrl.searchParams.set("ip", ip);

  return NextResponse.rewrite(nextUrl);
}

export const config = {
  matcher: "/api/auth/:path*",
};
