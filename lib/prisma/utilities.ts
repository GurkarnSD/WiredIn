import { PrismaClient } from "@prisma/client";
import { prisma } from "./index";

let client: PrismaClient | undefined;

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

async function getTagOptionsPrisma() {
  try {
    const tagOptions = await prisma.tagOption.findMany();
    return tagOptions;
  } catch (error) {
    throw new Error("Unable To Get Tag Options");
  } finally {
    await prisma.$disconnect();
  }
}

export { getTagOptionsPrisma };
