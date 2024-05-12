import { PrismaClient } from "@prisma/client";
import { prisma } from "./index";

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
