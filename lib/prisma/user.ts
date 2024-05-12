import { PrismaClient } from "@prisma/client";
import { prisma } from "./index";
import { randomUUID } from "crypto";
import { UserProfile } from "@/types";
import { Resend } from "resend";
import ActivateTemplate from "@/emails/activate";

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

type NewUser = {
  displayName: string;
  email: string;
  password: string;
};

async function checkLastNameChangePrisma(name: string): Promise<boolean> {
  try {
    const result = await prisma.nameChange.findFirst({
      where: { name },
    });

    if (result === null) {
      return true;
    }

    const daysSinceLastChange =
      new Date().getTime() - new Date(result.updatedAt).getTime();
    const minimumDays = 30 * 24 * 60 * 60 * 1000;

    if (daysSinceLastChange > minimumDays) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    throw new Error("Unable to check last name change");
  } finally {
    await prisma.$disconnect();
  }
}

async function checkDisplayNamePrisma(name: string): Promise<boolean> {
  try {
    const result = await prisma.credentials.findUnique({
      where: { displayName: name },
    });

    if (result === null) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    throw new Error("Unable to check display name");
  } finally {
    await prisma.$disconnect();
  }
}

async function changeDisplayNamePrisma(
  userId: string,
  oldName: string,
  newName: string
) {
  const isDisplayNameAvailable = await checkDisplayNamePrisma(newName);
  const isNameChangeAvailable = await checkLastNameChangePrisma(oldName);

  if (!isDisplayNameAvailable) {
    throw new Error("Display name is already in use");
  }

  if (!isNameChangeAvailable) {
    throw new Error("Name change is not available");
  }

  try {
    const result = await prisma.$transaction([
      prisma.nameChange.upsert({
        where: { name: oldName },
        create: {
          name: newName,
          credentials: { connect: { displayName: oldName } },
        },
        update: { name: newName },
      }),
      prisma.credentials.update({
        where: { displayName: oldName },
        data: { displayName: newName },
      }),
      prisma.user.update({
        where: { uid: userId, displayName: oldName },
        data: { displayName: newName },
      }),
    ]);

    return result;
  } catch (error) {
    throw new Error("Unable to change display name");
  } finally {
    await prisma.$disconnect();
  }
}

async function createUserPrisma(user: NewUser): Promise<boolean> {
  try {
    console.log("Creating credentials:");
    // Check if email already exists
    const existingCredsWithEmail = await prisma.credentials.findUnique({
      where: { email: user.email },
    });

    if (existingCredsWithEmail) {
      throw new Error("EMAIL_IN_USE");
    }

    // Check if display name already exists
    const existingCredsWithDisplayName = await prisma.credentials.findUnique({
      where: { displayName: user.displayName },
    });

    if (existingCredsWithDisplayName) {
      throw new Error("DISPLAY_NAME_IN_USE");
    }

    const authData = {
      displayName: user.displayName,
      email: user.email.toLowerCase(),
      password: user.password,
    };
    const credentials = await prisma.credentials.create({ data: authData });
    const userData = {
      email: user.email,
      displayName: user.displayName,
      uid: credentials.uid,
    };
    const result = await prisma.user.create({ data: userData });
    console.log("User created:", result);

    const token = await prisma.activateToken.create({
      data: {
        token: `${randomUUID()}${randomUUID()}`.replace(/-/g, ""),
        credsId: credentials.id,
      },
    });
    console.log("Token created:", token);

    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: "WiredIn <activation@wiredin.social>",
      to: user.email,
      subject: "Activate Your Account",
      react: ActivateTemplate({
        token: token.token,
        siteURL: process.env.API_URL || "",
        user: user.displayName,
      }),
    });

    return true;
  } catch (error: any) {
    if (error.message === "EMAIL_IN_USE") {
      throw new Error("EMAIL_IN_USE");
    } else if (error.message === "DISPLAY_NAME_IN_USE") {
      throw new Error("DISPLAY_NAME_IN_USE");
    }
    console.log("Error creating user:", error);
    throw new Error("Unable To Create User");
  } finally {
    await prisma.$disconnect();
  }
}

async function deleteUserPrisma(uid: string): Promise<UserProfile> {
  try {
    const result = await prisma.user.delete({ where: { uid } });
    return result as UserProfile;
  } catch (error) {
    throw new Error("Unable To Delete User");
  } finally {
    await prisma.$disconnect();
  }
}

async function getUserPrisma(uid: string, name: string): Promise<UserProfile> {
  console.log("Finding user:", uid);

  try {
    if (uid !== "") {
      const result = await prisma.user.findUnique({
        where: { uid },
        include: {
          _count: {
            select: { followers: true, following: true },
          },
        },
      });
      if (result === null) {
        throw new Error("User not found");
      }
      return result as UserProfile;
    } else if (name !== "") {
      const result = await prisma.user.findFirst({
        where: { displayName: { contains: name, mode: "insensitive" } },
        include: {
          _count: {
            select: { followers: true, following: true },
          },
        },
      });
      console.log("Found user:", result);
      if (result === null) {
        throw new Error("User not found");
      }
      return result as UserProfile;
    } else {
      throw new Error("No UID or name provided");
    }
  } catch (error) {
    throw new Error("Unable to find user");
  } finally {
    await prisma.$disconnect();
  }
}

type UserInfo = {
  title: string;
  bio: string;
  github: string;
  profilePic: string;
  bannerPic: string;
};

async function updateUserPrisma(
  userId: string,
  user: UserInfo
): Promise<UserProfile> {
  try {
    const data = {
      title: user.title,
      bio: user.bio,
      github: user.github,
      profilePic: user.profilePic,
      bannerPic: user.bannerPic,
    };

    const result = await prisma.user.update({
      where: { uid: userId },
      data: data,
    });
    return result;
  } catch (error) {
    throw new Error("Unable To Update User");
  } finally {
    await prisma.$disconnect();
  }
}

export {
  checkLastNameChangePrisma,
  changeDisplayNamePrisma,
  checkDisplayNamePrisma,
  createUserPrisma,
  deleteUserPrisma,
  getUserPrisma,
  updateUserPrisma,
};
