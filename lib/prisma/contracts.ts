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

    const imageCache: Record<string, string> = {};

    const updatedContracts = await Promise.all(
      contracts.map(async (contract) => {
        let profilePicUrl;
        if (imageCache[contract.user.profilePic]) {
          profilePicUrl = imageCache[contract.user.profilePic];
        } else {
          const res = await fetch(
            `${process.env.API_URL}/api/image/${contract.user.profilePic}`
          );
          const image = await res.json();
          profilePicUrl = image.url;
          imageCache[contract.user.profilePic] = profilePicUrl;
        }
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
  title: string
) {
  try {
    const contracts = await prisma.contract.findMany({
      where: { NOT: { userId }, title: { contains: title } },
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
        let profilePicUrl;
        if (imageCache[contract.user.profilePic]) {
          profilePicUrl = imageCache[contract.user.profilePic];
        } else {
          const res = await fetch(
            `${process.env.API_URL}/api/image/${contract.user.profilePic}`
          );
          const image = await res.json();
          profilePicUrl = image.url;
          imageCache[contract.user.profilePic] = profilePicUrl;
        }
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

async function deleteContractPrisma(uid: string) {
  try {
    await prisma.contract.delete({
      where: { uid },
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
  deleteContractPrisma,
  applyToContractPrisma,
};
