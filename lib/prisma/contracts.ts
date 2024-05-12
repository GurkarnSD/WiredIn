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

async function getMyContractsPrisma(userId: string) {
  try {
    const contracts = await prisma.contract.findMany({
      where: { userId },
      include: {
        user: true,
        skills: true,
        tags: true,
        applicants: {
          include: { skills: true },
        },
      },
    });

    const updatedContracts = await Promise.all(
      contracts.map(async (contract) => {
        const userImage = await (
          await fetch(
            `${process.env.API_URL}/api/image/${contract.user.profilePic}`
          )
        ).json();

        const applicants = await Promise.all(
          contract.applicants.map(async (applicant) => {
            const applicantImage = await (
              await fetch(
                `${process.env.API_URL}/api/image/${applicant.profilePic}`
              )
            ).json();

            return { ...applicant, profilePic: applicantImage.url };
          })
        );

        return {
          ...contract,
          user: { ...contract.user, profilePic: userImage.url },
          applicants,
        };
      })
    );

    return updatedContracts;
  } catch (error) {
    throw new Error("Unable To Get My Contracts");
  } finally {
    await prisma.$disconnect();
  }
}

async function getContractsPrisma(
  userId: string,
  page: number,
  pageSize: number
) {
  try {
    const contracts = await prisma.contract.findMany({
      where: { NOT: { userId } },
      include: {
        user: true,
        skills: true,
        tags: true,
        applicants: { where: { uid: userId } },
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    const imageCache: Record<string, Promise<string>> = {};

    const updatedContracts = await Promise.all(
      contracts.map(async (contract) => {
        if (!imageCache[contract.user.profilePic]) {
          imageCache[contract.user.profilePic] = fetch(
            `${process.env.API_URL}/api/image/${contract.user.profilePic}`
          )
            .then((res) => res.json())
            .then((image) => image.url);
        }
        const profilePicUrl = await imageCache[contract.user.profilePic];

        return {
          ...contract,
          user: { ...contract.user, profilePic: profilePicUrl },
        };
      })
    );

    return updatedContracts;
  } catch (error) {
    throw new Error("Unable To Get Contracts");
  } finally {
    await prisma.$disconnect();
  }
}

async function searchContractsPrisma(
  userId: string,
  page: number,
  pageSize: number,
  title: string,
  skills: string[],
  tags: string[]
) {
  try {
    let whereClause: {
      NOT: { userId: string };
      title: { contains: string | undefined };
      skills?: { some: { skill: { in: string[] } } };
      tags?: { some: { tag: { in: string[] } } };
    } = {
      NOT: { userId },
      title: { contains: title },
    };

    if (skills.length !== 0) {
      whereClause.skills = { some: { skill: { in: skills } } };
    }

    if (tags.length !== 0) {
      whereClause.tags = { some: { tag: { in: tags } } };
    }

    const contracts = await prisma.contract.findMany({
      where: whereClause,
      include: {
        user: true,
        skills: true,
        tags: true,
        applicants: { where: { uid: userId } },
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    const imageCache: Record<string, string> = {};

    const updatedContracts = await Promise.all(
      contracts.map(async (contract) => {
        if (!imageCache[contract.user.profilePic]) {
          imageCache[contract.user.profilePic] = await fetch(
            `${process.env.API_URL}/api/image/${contract.user.profilePic}`
          )
            .then((res) => res.json())
            .then((image) => image.url);
        }

        const profilePicUrl = await imageCache[contract.user.profilePic];

        return {
          ...contract,
          user: { ...contract.user, profilePic: profilePicUrl },
        };
      })
    );

    return updatedContracts;
  } catch (error) {
    console.log(error);
    throw new Error("Unable To Get Contracts");
  } finally {
    await prisma.$disconnect();
  }
}

async function createContractPrisma(
  userId: string,
  contract: {
    title: string;
    description: string;
    location: string;
    skills: string[];
    tags: string[];
  }
) {
  try {
    await prisma.contract.create({
      data: {
        title: contract.title,
        description: contract.description,
        location: contract.location,
        skills: {
          connect: contract.skills.map((skill) => ({ skill })),
        },
        tags: {
          connect: contract.tags.map((tag) => ({ tag })),
        },
        user: {
          connect: {
            uid: userId,
          },
        },
      },
    });
  } catch (error) {
    console.log(error);
    throw new Error("Unable To Create Post");
  } finally {
    await prisma.$disconnect();
  }
}

async function updateContractPrisma(
  userId: string,
  contract: {
    id: string;
    title: string;
    description: string;
    location: string;
    skills: string[];
    tags: string[];
  }
) {
  try {
    await prisma.contract.update({
      where: { userId, uid: contract.id },
      data: {
        title: contract.title,
        description: contract.description,
        location: contract.location,
        skills: {
          set: contract.skills.map((skill) => ({ skill })),
        },
        tags: {
          set: contract.tags.map((tag) => ({ tag })),
        },
      },
    });
  } catch (error) {
    throw new Error("Unable To Update Contract");
  } finally {
    await prisma.$disconnect();
  }
}

async function deleteContractPrisma(userId: string, uid: string) {
  try {
    await prisma.contract.delete({
      where: { userId, uid },
    });
  } catch (error) {
    throw new Error("Unable To Delete Contract");
  } finally {
    await prisma.$disconnect();
  }
}

async function applyToContractPrisma(contractId: string, userId: string) {
  try {
    await prisma.user.update({
      where: { uid: userId },
      data: {
        contractApps: {
          connect: {
            uid: contractId,
          },
        },
      },
    });
  } catch (error) {
    console.log(error);
    throw new Error("Unable To Apply To Contract");
  } finally {
    await prisma.$disconnect();
  }
}

export {
  getMyContractsPrisma,
  getContractsPrisma,
  searchContractsPrisma,
  createContractPrisma,
  updateContractPrisma,
  deleteContractPrisma,
  applyToContractPrisma,
};
