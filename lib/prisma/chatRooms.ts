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

async function authChatRoomPrisma(userId: string, channelUID: string) {
  try {
    const chatRooms = await prisma.chatRoom.findFirst({
      where: {
        AND: [
          {
            users: {
              some: {
                uid: userId,
              },
            },
          },
          {
            uid: channelUID,
          },
        ],
      },
    });

    if (chatRooms) return true;
    return false;
  } catch (error) {
    throw new Error("Unable To Get ChatRooms");
  } finally {
    await prisma.$disconnect();
  }
}

async function getChatRoomsPrisma(userId: string) {
  try {
    const chatRooms = await prisma.chatRoom.findMany({
      where: {
        users: {
          some: {
            uid: userId,
          },
        },
      },
      include: {
        users: {
          select: {
            uid: true,
            displayName: true,
            profilePic: true,
          },
        },
      },
    });

    const imageCache: Record<string, Promise<string>> = {};

    const updatedChatRooms = await Promise.all(
      chatRooms.map(async (chatRoom) => {
        const updatedUsers = await Promise.all(
          chatRoom.users
            .filter((user) => user.uid !== userId)
            .map(async (user) => {
              if (!imageCache[user.profilePic]) {
                imageCache[user.profilePic] = fetch(
                  `${process.env.API_URL}/api/image/${user.profilePic}`
                )
                  .then((res) => res.json())
                  .then((image) => image.url);
              }
              const userImageURL = await imageCache[user.profilePic];

              return { ...user, profilePic: userImageURL };
            })
        );

        return { ...chatRoom, users: updatedUsers };
      })
    );

    return updatedChatRooms;
  } catch (error) {
    throw new Error("Unable To Get ChatRooms");
  } finally {
    await prisma.$disconnect();
  }
}

async function findChatRoomPrisma(userId1: string, userId2: string) {
  try {
    const chatRoom = await prisma.chatRoom.findFirst({
      where: {
        AND: [
          {
            users: {
              some: {
                uid: userId1,
              },
            },
          },
          {
            users: {
              some: {
                uid: userId2,
              },
            },
          },
        ],
      },
    });

    if (chatRoom) {
      return chatRoom;
    }

    const newChatRoom = await prisma.chatRoom.create({
      data: {
        users: {
          connect: [
            {
              uid: userId1,
            },
            {
              uid: userId2,
            },
          ],
        },
      },
    });

    return newChatRoom;
  } catch (error) {
    throw new Error("Unable To Get ChatRoom");
  } finally {
    await prisma.$disconnect();
  }
}

async function deleteChatRoomPrisma(userId: string, chatRoomId: string) {
  try {
    await prisma.chatRoom.delete({
      where: {
        users: {
          some: {
            uid: userId,
          },
        },
        uid: chatRoomId,
      },
    });
  } catch (error) {
    throw new Error("Unable To Delete ChatRoom");
  } finally {
    await prisma.$disconnect();
  }
}

export {
  authChatRoomPrisma,
  getChatRoomsPrisma,
  findChatRoomPrisma,
  deleteChatRoomPrisma,
};
