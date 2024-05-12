import { PrismaClient } from "@prisma/client";
import { prisma } from "./index";
import { ChatMessage } from "@/types";

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

async function getMessagesPrisma(userId: string, chatRoomId: string) {
  try {
    const chatroom = await prisma.chatRoom.findFirst({
      where: {
        users: {
          some: {
            uid: userId,
          },
        },
        uid: chatRoomId,
      },
      include: {
        messages: {
          include: {
            attachments: true,
          },
        },
      },
    });

    if (!chatroom) {
      throw new Error("Chatroom Not Found");
    }

    const updatedMessages = await Promise.all(
      chatroom.messages.map(async (message) => {
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

    const createdMessageWithAttachments =
      createdMessage as unknown as ChatMessage;

    createdMessageWithAttachments.attachments = await Promise.all(
      attachments.map(async (attachment) => {
        const res = await fetch(
          `${process.env.API_URL}/api/image/${attachment}`
        );
        const image = await res.json();
        attachment = image.url;
        return attachment;
      })
    );

    return createdMessageWithAttachments;
  } catch (error) {
    throw new Error("Unable To Create Message");
  } finally {
    await prisma.$disconnect();
  }
}

async function deleteMessagePrisma(userId: string, messageId: number) {
  try {
    await prisma.message.delete({
      where: {
        userId: userId,
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
