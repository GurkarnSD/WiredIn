import { prisma } from "./index";

let client: any;

async function init() {
  if (client) return;
  try {
    client = await prisma;
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
    console.log("Creating user:", user);
    const result = await prisma.user.create({ data: user });
    console.log("User created:", result);
    return true;
  } catch (error) {
    console.log("Error creating user:", error);
    throw new Error("Unable To Create User");
  }
}

async function deleteUserPrisma(uid: string): Promise<any> {
  try {
    const result = await prisma.user.delete({ where: { uid } });
    return result;
  } catch (error) {
    throw new Error("Unable To Delete User");
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
  }
}

async function updateUserPrisma(user: any): Promise<any> {
  try {
    const result = await prisma.user.update({
      where: { uid: user.uid },
      data: user,
    });
    return result;
  } catch (error) {
    throw new Error("Unable To Update User");
  }
}

export { createUserPrisma, deleteUserPrisma, getUserPrisma, updateUserPrisma };
