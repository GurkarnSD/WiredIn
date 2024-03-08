import { PrismaClient } from "@prisma/client";
import { prisma } from "./index";

let client: PrismaClient | undefined;

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

async function getResponsesPrisma(commentId: number) {
  const imageCache: Record<string, string> = {};
  try {
    const responses = await prisma.response.findMany({
      where: { commentId: commentId },
      include: {
        user: { select: { uid: true, displayName: true, profilePic: true } },
        likes: {
          select: {
            uid: true,
          },
        },
        _count: {
          select: {
            likes: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    if (!responses) {
      throw new Error("Responses Not Found");
    }

    const updatedResponses = await Promise.all(
      responses.map(async (response) => {
        if (response.user.profilePic) {
          if (imageCache[response.user.profilePic]) {
            return {
              ...response,
              user: {
                ...response.user,
                profilePic: imageCache[response.user.profilePic],
              },
            };
          } else {
            const res = await fetch(
              `${process.env.API_URL}/api/image/${response.user.profilePic}`
            );
            const image = await res.json();
            imageCache[response.user.profilePic] = image.url;

            return {
              ...response,
              user: { ...response.user, profilePic: image.url },
            };
          }
        }
        return response;
      })
    );

    return updatedResponses;
  } catch (error) {
    console.error(error);
    throw new Error("Unable To Get Responses");
  } finally {
    await prisma.$disconnect();
  }
}

async function createResponsePrisma(
  userId: string,
  commentId: number,
  response: string
) {
  try {
    await prisma.response.create({
      data: {
        text: response,
        userId: userId,
        commentId: commentId,
      },
    });
  } catch (error) {
    throw new Error("Unable To Create Response");
  } finally {
    await prisma.$disconnect();
  }
}

async function deleteResponsePrisma(id: number) {
  try {
    await prisma.response.delete({
      where: { id: id },
    });
  } catch (error) {
    throw new Error("Unable To Delete Response");
  } finally {
    await prisma.$disconnect();
  }
}

async function likeResponsePrisma(user: string, responseId: number) {
  try {
    await prisma.user.update({
      where: { uid: user },
      data: {
        likedResponses: { connect: { id: responseId } },
      },
    });

    return true;
  } catch (error) {
    throw new Error("Unable To Like Response");
  } finally {
    await prisma.$disconnect();
  }
}

async function unlikeResponsePrisma(user: string, responseId: number) {
  try {
    await prisma.user.update({
      where: { uid: user },
      data: {
        likedResponses: { disconnect: { id: responseId } },
      },
    });

    return true;
  } catch (error) {
    throw new Error("Unable To Unlike Response");
  } finally {
    await prisma.$disconnect();
  }
}

export {
  getResponsesPrisma,
  createResponsePrisma,
  deleteResponsePrisma,
  likeResponsePrisma,
  unlikeResponsePrisma,
};
