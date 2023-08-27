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

export async function getProjectsPrisma(userId: string) {
  try {
    const skills = await prisma.project.findMany({
      where: { userId },
      include: { skills: true },
    });
    return skills;
  } catch (error) {
    throw new Error("Unable To Get Projects");
  }
}

export async function createProjectPrisma(
  userId: string,
  project: {
    title: string;
    description: string;
    deployment: string;
    source: string;
    start: string;
    end: string;
    current: boolean;
    skills: any;
  }
) {
  try {
    await prisma.project.create({
      data: {
        title: project.title,
        description: project.description,
        deployment: project.deployment,
        source: project.source,
        skills: {
          connect: [...project.skills],
        },
        current: project.current,
        start: project.start,
        ...(project.end !== "-01T00:00:00.000Z" ? { end: project.end } : {}),
        user: { connect: { uid: userId } },
      },
    });
  } catch (error) {
    throw new Error("Unable To Create Project");
  }
}

export async function deleteProjectPrisma(id: string) {
  try {
    const queryId = parseInt(id, 10);

    await prisma.project.delete({
      where: { id: queryId },
    });
  } catch (error) {
    throw new Error("Unable To Delete Project");
  }
}
