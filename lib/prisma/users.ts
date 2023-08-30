import { prisma } from "./index";

let client: any;

async function init() {
  if (client) return;
  try {
    client = prisma;
    console.log("Connected to PlanetScale");
  } catch (error) {
    console.log("Error connecting to PlanetScale", error);
    throw new Error("Could not initialize PlanetScale connection");
  }
}

(async () => {
  await init();
})();

async function getRandomUsersPrisma(uid: string): Promise<any> {
  console.log("Fetching random users");

  try {
    const randomUsers = await prisma.$queryRaw`
      SELECT * FROM User
      WHERE uid != ${uid}
      ORDER BY RAND()
      LIMIT 3;
    `;

    return randomUsers;
  } catch (error) {
    throw new Error("Unable to fetch random users");
  } finally {
    await prisma.$disconnect();
  }
}

export { getRandomUsersPrisma };
