import { PrismaClient } from "@prisma/client";
import { prisma } from "./index";
import { UserProfile } from "@/types";

let client: PrismaClient | undefined;

async function init() {
  if (client) return;
  try {
    client = prisma;
    console.log("Connected to Supabase");
  } catch (error) {
    console.log("Error connecting to Supabase", error);
    throw new Error("Could not initialize Supabase connection");
  }
}

(async () => {
  await init();
})();

async function getRandomUsersPrisma(uid: string): Promise<UserProfile[]> {
  try {
    const randomUsers = (await prisma.$queryRaw`
      SELECT * FROM "User"
      WHERE uid != ${uid}
      ORDER BY RANDOM()
      LIMIT 3;
    `) as UserProfile[];

    return randomUsers;
  } catch (error) {
    throw new Error("Unable to fetch random users");
  } finally {
    await prisma.$disconnect();
  }
}

async function searchUsersPrisma(
  uid: string,
  query: string
): Promise<UserProfile[]> {
  try {
    const users = (await prisma.user.findMany({
      where: {
        uid: { not: uid },
        displayName: {
          contains: query,
          mode: "insensitive",
        },
      },
      take: 5,
    })) as UserProfile[];

    return users;
  } catch (error) {
    throw new Error("Unable to search for users");
  } finally {
    await prisma.$disconnect();
  }
}

export { getRandomUsersPrisma, searchUsersPrisma };
