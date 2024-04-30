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

async function getCommentsPrisma(postId: string) {
  const imageCache: Record<string, string> = {};
  try {
    const comments = await prisma.comment.findMany({
      where: { postId: postId },
      include: {
        user: {
          select: {
            uid: true,
            displayName: true,
            profilePic: true,
          },
        },
        likes: {
          select: {
            uid: true,
          },
        },
        _count: {
          select: {
            likes: true,
            responses: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    if (!comments) {
      throw new Error("Comments Not Found");
    }

    const updatedComments = await Promise.all(
      comments.map(async (comment) => {
        if (comment.user.profilePic) {
          if (imageCache[comment.user.profilePic]) {
            return {
              ...comment,
              user: {
                ...comment.user,
                profilePic: imageCache[comment.user.profilePic],
              },
            };
          } else {
            const res = await fetch(
              `${process.env.API_URL}/api/image/${comment.user.profilePic}`
            );
            const image = await res.json();
            imageCache[comment.user.profilePic] = image.url;

            return {
              ...comment,
              user: { ...comment.user, profilePic: image.url },
            };
          }
        }
        return comment;
      })
    );

    return updatedComments;
  } catch (error) {
    console.error(error);
    throw new Error("Unable To Get Comments");
  } finally {
    await prisma.$disconnect();
  }
}

async function createCommentPrisma(
  userId: string,
  postId: string,
  comment: string
) {
  try {
    await prisma.comment.create({
      data: {
        text: comment,
        userId: userId,
        postId: postId,
      },
    });
  } catch (error) {
    throw new Error("Unable To Create Comment");
  } finally {
    await prisma.$disconnect();
  }
}

async function updateCommentPrisma(
  userId: string,
  commentId: number,
  comment: string
) {
  try {
    await prisma.comment.update({
      where: { userId, id: commentId },
      data: {
        text: comment,
      },
    });
  } catch (error) {
    throw new Error("Unable To Update Comment");
  } finally {
    await prisma.$disconnect();
  }
}

async function deleteCommentPrisma(userId: string, id: number) {
  try {
    await prisma.comment.delete({
      where: { userId, id: id },
    });
  } catch (error) {
    throw new Error("Unable To Delete Comment");
  } finally {
    await prisma.$disconnect();
  }
}

async function likeCommentPrisma(user: string, commentId: number) {
  try {
    await prisma.user.update({
      where: { uid: user },
      data: {
        likedComments: { connect: { id: commentId } },
      },
    });

    return true;
  } catch (error) {
    throw new Error("Unable To Like Comment");
  } finally {
    await prisma.$disconnect();
  }
}

async function unlikeCommentPrisma(user: string, commentId: number) {
  try {
    await prisma.user.update({
      where: { uid: user },
      data: {
        likedComments: { disconnect: { id: commentId } },
      },
    });

    return true;
  } catch (error) {
    throw new Error("Unable To Unlike Comment");
  } finally {
    await prisma.$disconnect();
  }
}

export {
  getCommentsPrisma,
  createCommentPrisma,
  updateCommentPrisma,
  deleteCommentPrisma,
  likeCommentPrisma,
  unlikeCommentPrisma,
};
