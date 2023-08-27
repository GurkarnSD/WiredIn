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

export async function getExperiencesPrisma(userId: string) {
  try {
    const skills = await prisma.experience.findMany({
      where: { userId },
      include: { skills: true },
    });
    return skills;
  } catch (error) {
    throw new Error("Unable To Get Experiences");
  }
}

export async function createExperiencePrisma(
  userId: string,
  experience: {
    title: string;
    company: string;
    image: string;
    description: string;
    skills: any;
    current: boolean;
    start: string;
    end: string;
  }
) {
  try {
    await prisma.experience.create({
      data: {
        title: experience.title,
        company: experience.company,
        description: experience.description,
        ...(experience.image ? { image: experience.image } : {}),
        skills: {
          connect: [...experience.skills],
        },
        current: experience.current,
        start: experience.start,
        ...(experience.end !== "-01T00:00:00.000Z"
          ? { end: experience.end }
          : {}),
        user: { connect: { uid: userId } },
      },
    });
  } catch (error) {
    throw new Error("Unable To Create Experience");
  }
}

export async function deleteExperiencePrisma(id: string) {
  try {
    const queryId = parseInt(id, 10);

    await prisma.experience.delete({
      where: { id: queryId },
    });
  } catch (error) {
    throw new Error("Unable To Delete Experience");
  }
}
