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

async function getMyJobsPrisma(userId: string) {
  try {
    const jobs = await prisma.job.findMany({
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

    const updatedJobs = await Promise.all(
      jobs.map(async (job) => {
        const userImage = await (
          await fetch(`${process.env.API_URL}/api/image/${job.user.profilePic}`)
        ).json();

        const applicants = await Promise.all(
          job.applicants.map(async (applicant) => {
            const applicantImage = await (
              await fetch(
                `${process.env.API_URL}/api/image/${applicant.profilePic}`
              )
            ).json();

            return { ...applicant, profilePic: applicantImage.url };
          })
        );

        return {
          ...job,
          user: { ...job.user, profilePic: userImage.url },
          applicants,
        };
      })
    );

    return updatedJobs;
  } catch (error) {
    throw new Error("Unable To Get My Jobs");
  } finally {
    await prisma.$disconnect();
  }
}

async function getJobsPrisma(userId: string, page: number, pageSize: number) {
  try {
    const jobs = await prisma.job.findMany({
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

    const updatedJobs = await Promise.all(
      jobs.map(async (job) => {
        let profilePicUrl;
        if (imageCache[job.user.profilePic]) {
          profilePicUrl = imageCache[job.user.profilePic];
        } else {
          const res = await fetch(
            `${process.env.API_URL}/api/image/${job.user.profilePic}`
          );
          const image = await res.json();
          profilePicUrl = image.url;
          imageCache[job.user.profilePic] = profilePicUrl;
        }
        return {
          ...job,
          user: { ...job.user, profilePic: profilePicUrl },
        };
      })
    );

    return updatedJobs;
  } catch (error) {
    throw new Error("Unable To Get Jobs");
  } finally {
    await prisma.$disconnect();
  }
}

async function searchJobsPrisma(
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

    const jobs = await prisma.job.findMany({
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

    const updatedJobs = await Promise.all(
      jobs.map(async (job) => {
        let profilePicUrl;
        if (imageCache[job.user.profilePic]) {
          profilePicUrl = imageCache[job.user.profilePic];
        } else {
          const res = await fetch(
            `${process.env.API_URL}/api/image/${job.user.profilePic}`
          );
          const image = await res.json();
          profilePicUrl = image.url;
          imageCache[job.user.profilePic] = profilePicUrl;
        }
        return {
          ...job,
          user: { ...job.user, profilePic: profilePicUrl },
        };
      })
    );

    return updatedJobs;
  } catch (error) {
    throw new Error("Unable To Get Jobs");
  } finally {
    await prisma.$disconnect();
  }
}

async function createJobPrisma(
  userId: string,
  job: {
    title: string;
    description: string;
    location: string;
    skills: string[];
    tags: string[];
    salary: number;
    hourly: number;
    start: string;
    end: string;
  }
) {
  try {
    await prisma.job.create({
      data: {
        title: job.title,
        description: job.description,
        location: job.location,
        salary: job.salary,
        hourly: job.hourly,
        start: job.start,
        end: job.end,
        skills: {
          connect: job.skills.map((skill) => ({ skill })),
        },
        tags: {
          connect: job.tags.map((tag) => ({ tag })),
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

async function deleteJobPrisma(uid: string) {
  try {
    await prisma.job.delete({
      where: { uid },
    });
  } catch (error) {
    throw new Error("Unable To Delete Job");
  } finally {
    await prisma.$disconnect();
  }
}

async function applyToJobPrisma(jobId: string, userId: string) {
  try {
    await prisma.user.update({
      where: { uid: userId },
      data: {
        jobApps: {
          connect: {
            uid: jobId,
          },
        },
      },
    });
  } catch (error) {
    console.log(error);
    throw new Error("Unable To Apply To Job");
  } finally {
    await prisma.$disconnect();
  }
}

export {
  getMyJobsPrisma,
  getJobsPrisma,
  searchJobsPrisma,
  createJobPrisma,
  deleteJobPrisma,
  applyToJobPrisma,
};
