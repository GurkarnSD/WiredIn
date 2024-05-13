import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const { nextUrl, geo, ip } = req;
  const location = geo.city + ", " + geo.region + ", " + geo.country;

  nextUrl.searchParams.set("location", location);
  nextUrl.searchParams.set("ip", ip);

  return NextResponse.rewrite(nextUrl);
}

export const config = {
  matcher: "/api/location",
};
