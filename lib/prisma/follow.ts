import { UserProfile } from "@/types";
import { prisma } from "./index";
import { PrismaClient } from "@prisma/client";

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

async function checkFollowing(user: string, otherUser: string) {
  try {
    const userData = await prisma.user.findUnique({
      where: { uid: user },
      include: { following: { where: { uid: otherUser } } },
    });

    return Boolean(userData?.following.length);
  } catch (error) {
    throw new Error("Unable To Check Following");
  } finally {
    await prisma.$disconnect();
  }
}

async function followUserPrisma(user: string, otherUser: string) {
  try {
    await prisma.user.update({
      where: { uid: user },
      data: {
        following: { connect: { uid: otherUser } },
      },
    });
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

async function getFollowers(user: string, otherUser: string) {
  try {
    const userData = await prisma.user.findUnique({
      where: { uid: user },
      include: { followers: true },
    });

    if (!userData) {
      throw new Error("User Not Found");
    }

    const followers = userData.followers;

    const otherUserData = await prisma.user.findUnique({
      where: { uid: otherUser },
      include: { following: true },
    });

    if (!otherUserData) {
      throw new Error("Other User Not Found");
    }

    const otherUserFollowing = new Set(
      otherUserData.following.map((user) => user.uid)
    );

    const imageCache: Record<string, Promise<string>> = {};
    const updatedFollowers = await Promise.all(
      followers.map(async (user: UserProfile) => {
        if (!imageCache[user.profilePic]) {
          imageCache[user.profilePic] = await fetch(
            `${process.env.API_URL}/api/image/${user.profilePic}`
          )
            .then((res) => res.json())
            .then((image) => image.url);
        }
        const profilePicUrl = await imageCache[user.profilePic];

        const isFollowedByOtherUser = otherUserFollowing.has(user.uid);

        return {
          ...user,
          profilePic: profilePicUrl,
          sessionUserFollows: isFollowedByOtherUser,
        };
      })
    );

    return updatedFollowers;
  } catch (error) {
    throw new Error("Unable To Get Followers");
  } finally {
    await prisma.$disconnect();
  }
}

async function getFollowing(user: string, otherUser: string) {
  try {
    const userData = await prisma.user.findUnique({
      where: { uid: user },
      include: { following: true },
    });

    if (!userData) {
      throw new Error("User Not Found");
    }

    const following = userData.following;

    const otherUserData = await prisma.user.findUnique({
      where: { uid: otherUser },
      include: { following: true },
    });

    if (!otherUserData) {
      throw new Error("Other User Not Found");
    }

    const otherUserFollowing = new Set(
      otherUserData.following.map((user) => user.uid)
    );

    const imageCache: Record<string, Promise<string>> = {};
    const updatedFollowing = await Promise.all(
      following.map(async (user: UserProfile) => {
        if (!imageCache[user.profilePic]) {
          imageCache[user.profilePic] = fetch(
            `${process.env.API_URL}/api/image/${user.profilePic}`
          )
            .then((res) => res.json())
            .then((image) => image.url);
        }

        const profilePicUrl = await imageCache[user.profilePic];

        const isFollowedByOtherUser = otherUserFollowing.has(user.uid);

        return {
          ...user,
          profilePic: profilePicUrl,
          sessionUserFollows: isFollowedByOtherUser,
        };
      })
    );

    return updatedFollowing;
  } catch (error) {
    throw new Error("Unable To Get Followed Users");
  } finally {
    await prisma.$disconnect();
  }
}

export {
  checkFollowing,
  followUserPrisma,
  unfollowUserPrisma,
  getFollowers,
  getFollowing,
};
