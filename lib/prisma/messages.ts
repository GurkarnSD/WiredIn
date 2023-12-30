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

async function getMessagesPrisma(chatRoomId: string) {
  try {
    const messages = await prisma.message.findMany({
      where: {
        chatRoomId: chatRoomId,
      },
    });
    return messages;
  } catch (error) {
    throw new Error("Unable To Get Messages");
  } finally {
    await prisma.$disconnect();
  }
}

async function createMessagePrisma(
  chatRoomId: string,
  userId: string,
  message: string
) {
  try {
    const result = await prisma.message.create({
      data: {
        text: message,
        chatRoomId: chatRoomId,
        userId: userId,
      },
    });

    return result;
  } catch (error) {
    throw new Error("Unable To Create Message");
  } finally {
    await prisma.$disconnect();
  }
}

async function deleteMessagePrisma(messageId: number) {
  try {
    await prisma.message.delete({
      where: {
        id: messageId,
      },
    });
  } catch (error) {
    throw new Error("Unable To Delete Message");
  } finally {
    await prisma.$disconnect();
  }
}

export { getMessagesPrisma, createMessagePrisma, deleteMessagePrisma };
