import { UserSession } from "@/types";
import { signOut } from "next-auth/react";

export default async function SessionValidator(session: UserSession) {
  const locationInfo = await fetch("/api/location").then((res) => res.json());

  const userAgent = navigator.userAgent;
  const ipAddress = locationInfo.ipAddress;
  const location = locationInfo.location;

  // Session Hijacking Prevention
  if (
    session.ipAddress !== ipAddress ||
    session.location !== location ||
    session.userAgent !== userAgent
  ) {
    await signOut();
    return false;
  }

  return true;
}
