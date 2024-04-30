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

async function getSkillOptionsPrisma() {
  try {
    const skillOptions = await prisma.skillOption.findMany();
    return skillOptions;
  } catch (error) {
    throw new Error("Unable To Get Skill Options");
  } finally {
    await prisma.$disconnect();
  }
}

async function getSkillsPrisma(userId: string) {
  try {
    const skills = await prisma.skill.findMany({
      where: { userId },
    });
    return skills;
  } catch (error) {
    throw new Error("Unable To Get Skills");
  } finally {
    await prisma.$disconnect();
  }
}

async function addSkillPrisma(
  userId: string,
  skill: { name: string; learnedIn: number }
) {
  try {
    await prisma.skill.create({
      data: {
        skill: { connect: { skill: skill.name } },
        learnedIn: skill.learnedIn,
        user: { connect: { uid: userId } },
      },
    });
  } catch (error) {
    throw new Error("Unable To Add Skill");
  } finally {
    await prisma.$disconnect();
  }
}

async function deleteSkillPrisma(userId: string, id: string) {
  try {
    const queryId = parseInt(id, 10);

    await prisma.skill.delete({
      where: { userId, id: queryId },
    });
  } catch (error) {
    throw new Error("Unable To Delete Skill");
  } finally {
    await prisma.$disconnect();
  }
}

export {
  getSkillOptionsPrisma,
  getSkillsPrisma,
  addSkillPrisma,
  deleteSkillPrisma,
};
