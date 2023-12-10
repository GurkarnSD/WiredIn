import { prisma } from "./index";
import { randomUUID } from "crypto";

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

async function createUserPrisma(user: any): Promise<boolean> {
  try {
    console.log("Creating credentials:");
    const authData = {
      displayName: user.displayName,
      email: user.email,
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

    const data = await fetch(`${process.env.API_URL}/api/send/activate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: user.email,
        token: token.token,
        user: user.displayName,
      }),
    });
    console.log(data);

    return true;
  } catch (error) {
    console.log("Error creating user:", error);
    throw new Error("Unable To Create User");
  } finally {
    await prisma.$disconnect();
  }
}

async function deleteUserPrisma(uid: string): Promise<any> {
  try {
    const result = await prisma.user.delete({ where: { uid } });
    return result;
  } catch (error) {
    throw new Error("Unable To Delete User");
  } finally {
    await prisma.$disconnect();
  }
}

async function getUserPrisma(uid: string, name: string): Promise<any> {
  console.log("Finding user:", uid);

  try {
    if (uid !== "") {
      const result = await prisma.user.findUnique({
        where: { uid },
        include: {
          following: true,
          followers: true,
        },
      });
      return result;
    } else if (name !== "") {
      const result = await prisma.user.findFirst({
        where: { displayName: { contains: name.toLowerCase() } },
        include: {
          following: true,
          followers: true,
        },
      });
      console.log("Found user:", result);
      return result;
    }
  } catch (error) {
    throw new Error("Unable to find user");
  } finally {
    await prisma.$disconnect();
  }
}

async function updateUserPrisma(user: any): Promise<any> {
  try {
    const data = {
      title: user.title,
      bio: user.bio,
      github: user.github,
      profilePic: user.profilePic,
      bannerPic: user.bannerPic,
    };

    const result = await prisma.user.update({
      where: { uid: user.uid },
      data: data,
    });
    return result;
  } catch (error) {
    throw new Error("Unable To Update User");
  } finally {
    await prisma.$disconnect();
  }
}

export { createUserPrisma, deleteUserPrisma, getUserPrisma, updateUserPrisma };
