import { prisma } from "./index";
import { getUserPrisma, updateUserPrisma } from "./user";

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

async function followUserPrisma(user: string, otherUser: string) {
  try {
    console.log("Getting user:", user);
    console.log("Getting other user:", otherUser);
    const userData = await getUserPrisma(user, "");
    const otherUserData = await getUserPrisma(otherUser, "");

    if (
      !otherUserData.followers.some((follower: any) => follower.uid === user) ||
      !userData.following.some((following: any) => following.uid === otherUser)
    ) {
      await prisma.user.update({
        where: { uid: user },
        data: {
          following: { connect: { uid: otherUser } },
        },
      });
    }

    return true;
  } catch (error) {
    throw new Error("Unable To Follow User");
  } finally {
    await prisma.$disconnect();
  }
}

async function unfollowUserPrisma(user: string, otherUser: string) {
  try {
    await prisma.user.update({
      where: { uid: user },
      data: {
        following: { disconnect: { uid: otherUser } },
      },
    });

    return true;
  } catch (error) {
    throw new Error("Unable To Unfollow User");
  } finally {
    await prisma.$disconnect();
  }
}

export { followUserPrisma, unfollowUserPrisma };
