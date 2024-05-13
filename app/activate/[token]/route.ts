import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function GET(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  const { token } = params;

  const user = await prisma.credentials.findFirst({
    where: {
      ActivateToken: {
        AND: [
          {
            activatedAt: null,
          },
          {
            createdAt: {
              gt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 24 hours ago
            },
          },
          {
            token,
          },
        ],
      },
    },
  });

  if (!user) {
    throw new Error("Invalid Token");
  }

  await prisma.activateToken.update({
    where: {
      token,
    },
    data: {
      activatedAt: new Date(),
    },
  });

  redirect("/login");
}
