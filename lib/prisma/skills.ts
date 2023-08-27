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

export async function getSkillsPrisma(userId: string) {
  try {
    const skills = await prisma.skill.findMany({
      where: { userId },
    });
    return skills;
  } catch (error) {
    throw new Error("Unable To Get Skills");
  }
}

export async function addSkillPrisma(
  userId: string,
  skill: { name: string; learnedIn: number }
) {
  try {
    await prisma.skill.create({
      data: {
        name: skill.name,
        learnedIn: skill.learnedIn,
        user: { connect: { uid: userId } },
      },
    });
  } catch (error) {
    throw new Error("Unable To Add Skill");
  }
}

export async function deleteSkillPrisma(id: string) {
  try {
    const queryId = parseInt(id, 10);

    await prisma.skill.delete({
      where: { id: queryId },
    });
  } catch (error) {
    throw new Error("Unable To Delete Skill");
  }
}
