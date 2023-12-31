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
      include: {
        attachments: true,
      },
    });

    const updatedMessages = await Promise.all(
      messages.map(async (message) => {
        const attachments = await Promise.all(
          message.attachments.map(async (attachment) => {
            const res = await fetch(
              `${process.env.API_URL}/api/image/${attachment.key}`
            );
            const image = await res.json();
            return image.url;
          })
        );
        message.attachments = attachments;
        return message;
      })
    );

    return updatedMessages;
  } catch (error) {
    throw new Error("Unable To Get Messages");
  } finally {
    await prisma.$disconnect();
  }
}

async function createMessagePrisma(
  chatRoomId: string,
  userId: string,
  message: string,
  attachments: string[]
) {
  try {
    const createdMessage = await prisma.message.create({
      data: {
        text: message,
        chatRoomId: chatRoomId,
        userId: userId,
      },
      include: {
        attachments: true,
      },
    });

    if (attachments.length > 0) {
      attachments.map(async (attachment) => {
        try {
          await prisma.attachment.create({
            data: {
              key: attachment,
              messageId: createdMessage.id,
            },
          });
        } catch (error) {
          throw new Error("Unable To Create Attachment");
        }
      });
    }

    createdMessage.attachments = await Promise.all(
      attachments.map(async (attachment) => {
        const res = await fetch(
          `${process.env.API_URL}/api/image/${attachment}`
        );
        const image = await res.json();
        attachment = image.url;
        return attachment;
      })
    );

    return createdMessage;
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
