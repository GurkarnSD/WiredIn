import { prisma } from "./index";

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

    let imageCache: Record<string, string> = {};

    const updatedChatRooms = await Promise.all(
      chatRooms.map(async (chatRoom) => {
        const updatedUsers = await Promise.all(
          chatRoom.users
            .filter((user) => user.uid !== userId)
            .map(async (user) => {
              let userImageURL;
              if (imageCache[user.profilePic]) {
                userImageURL = imageCache[user.profilePic];
              } else {
                const res = await fetch(
                  `${process.env.API_URL}/api/image/${user.profilePic}`
                );
                const image = await res.json();
                userImageURL = image.url;
                imageCache[user.profilePic] = image.url;
              }
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

async function deleteChatRoomPrisma(chatRoomId: string) {
  try {
    await prisma.chatRoom.delete({
      where: {
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
