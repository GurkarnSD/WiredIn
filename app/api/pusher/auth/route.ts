import { pusherServer } from "@/lib/pusher";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function POST(req: Request) {
  const body = await req.text();
  const session = await getServerSession(authOptions);

  const [socketId, channelName] = body
    .split("&")
    .map((str) => str.split("=")[1]);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session && session.user) {
    const presenceData = {
      user_id: session.user.uid,
      user_info: { name: session.user.displayName, userId: session.user.uid },
    };

    try {
      const auth = pusherServer.authorizeChannel(
        socketId,
        channelName,
        presenceData
      );

      return NextResponse.json(auth);
    } catch (error) {
      NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }
}
