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

async function getProjectsPrisma(userId: string) {
  try {
    const skills = await prisma.project.findMany({
      where: { userId },
      include: { skills: true },
      orderBy: { start: "desc" },
    });
    return skills;
  } catch (error) {
    throw new Error("Unable To Get Projects");
  } finally {
    await prisma.$disconnect();
  }
}

type SkillWhereUniqueInput = {
  id: number;
};

async function createProjectPrisma(
  userId: string,
  project: {
    title: string;
    description: string;
    deployment: string;
    source: string;
    start: string;
    end: string;
    current: boolean;
    skills: SkillWhereUniqueInput[];
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
  } finally {
    await prisma.$disconnect();
  }
}

async function updateProjectPrisma(
  userId: string,
  project: {
    id: number;
    title: string;
    description: string;
    deployment: string;
    source: string;
    start: string;
    end: string;
    current: boolean;
    prevSkills: SkillWhereUniqueInput[];
    skills: SkillWhereUniqueInput[];
  }
) {
  try {
    await prisma.project.update({
      where: { userId, id: project.id },
      data: {
        title: project.title,
        description: project.description,
        deployment: project.deployment,
        source: project.source,
        skills: {
          disconnect: [...project.prevSkills],
          connect: [...project.skills],
        },
        current: project.current,
        start: project.start,
        ...(project.end !== "-01T00:00:00.000Z" ? { end: project.end } : {}),
      },
    });
  } catch (error) {
    throw new Error("Unable To Update Project");
  } finally {
    await prisma.$disconnect();
  }
}

async function deleteProjectPrisma(userId: string, id: string) {
  try {
    const queryId = parseInt(id, 10);

    await prisma.project.delete({
      where: { userId, id: queryId },
    });
  } catch (error) {
    throw new Error("Unable To Delete Project");
  } finally {
    await prisma.$disconnect();
  }
}

export {
  getProjectsPrisma,
  createProjectPrisma,
  updateProjectPrisma,
  deleteProjectPrisma,
};
