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

async function getPostsPrisma(userId: string, page: number, pageSize: number) {
  try {
    const user = await prisma.user.findUnique({
      where: { uid: userId },
      include: { following: { select: { uid: true } } },
    });

    if (!user) {
      throw new Error("User Not Found");
    }

    const posts = await prisma.post.findMany({
      where: {
        OR: [
          { userId: { in: user.following.map((user) => user.uid) } },
          { userId: user.uid },
        ],
      },
      include: {
        user: {
          select: {
            uid: true,
            title: true,
            displayName: true,
            profilePic: true,
          },
        },
        images: true,
        likes: {
          select: {
            uid: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    const imageCache: Record<string, string> = {};

    const updatedPosts = await Promise.all(
      posts.map(async (post) => {
        if (post.user.profilePic) {
          let profilePicUrl;
          if (imageCache[post.user.profilePic]) {
            profilePicUrl = imageCache[post.user.profilePic];
          } else {
            const res = await fetch(
              `${process.env.API_URL}/api/image/${post.user.profilePic}`
            );
            const image = await res.json();
            profilePicUrl = image.url;
            imageCache[post.user.profilePic] = profilePicUrl;
          }

          if (post.images.length > 0) {
            const imageUrls = await Promise.all(
              post.images.map(async (image) => {
                const res = await fetch(
                  `${process.env.API_URL}/api/image/${image.key}`
                );
                const data = await res.json();
                return data.url;
              })
            );
            return {
              ...post,
              user: { ...post.user, profilePic: profilePicUrl },
              images: imageUrls,
            };
          }
          return { ...post, user: { ...post.user, profilePic: profilePicUrl } };
        }
        return post;
      })
    );

    return updatedPosts;
  } catch (error) {
    console.error(error);
    throw new Error("Unable To Get Posts");
  } finally {
    await prisma.$disconnect();
  }
}

async function getPostPrisma(postId: string) {
  try {
    const post = await prisma.post.findFirst({
      where: { uid: postId },
      include: {
        user: {
          select: {
            uid: true,
            title: true,
            displayName: true,
            profilePic: true,
          },
        },
        images: true,
        likes: {
          select: {
            uid: true,
          },
        },
        comments: {
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
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
    });

    if (!post) {
      throw new Error("Post Not Found");
    }

    if (post.user.profilePic) {
      const res = await fetch(
        `${process.env.API_URL}/api/image/${post.user.profilePic}`
      );
      const image = await res.json();
      const imageCache: Record<string, string> = {};
      imageCache[post.user.profilePic] = image.url;
      const profilePicUrl = image.url;

      const updatedComments = await Promise.all(
        post.comments.map(async (comment) => {
          let commentProfilePicUrl;
          if (comment.user.profilePic) {
            if (imageCache[comment.user.profilePic]) {
              commentProfilePicUrl = imageCache[comment.user.profilePic];
            } else {
              const res = await fetch(
                `${process.env.API_URL}/api/image/${comment.user.profilePic}`
              );
              const image = await res.json();
              commentProfilePicUrl = image.url;
              imageCache[comment.user.profilePic] = commentProfilePicUrl;
            }
          }
          return {
            ...comment,
            user: { ...comment.user, profilePic: commentProfilePicUrl },
          };
        })
      );

      if (post.images.length > 0) {
        const imageUrls = await Promise.all(
          post.images.map(async (image) => {
            const res = await fetch(
              `${process.env.API_URL}/api/image/${image.key}`
            );
            const data = await res.json();
            return data.url;
          })
        );
        return {
          ...post,
          user: { ...post.user, profilePic: profilePicUrl },
          images: imageUrls,
          comments: updatedComments,
        };
      }
      return {
        ...post,
        user: { ...post.user, profilePic: profilePicUrl },
        comments: updatedComments,
      };
    }
  } catch (error) {
    console.error(error);
    throw new Error("Unable To Get Post");
  } finally {
    await prisma.$disconnect();
  }
}

async function createPostPrisma(
  userId: string,
  post: {
    text: string;
    images: string[];
  }
) {
  try {
    const createdPost = await prisma.post.create({
      data: {
        text: post.text,
        user: { connect: { uid: userId } },
      },
    });

    if (post.images.length > 0) {
      post.images.map(async (image) => {
        try {
          await prisma.image.create({
            data: {
              key: image,
              postId: createdPost.uid,
            },
          });
        } catch (error) {
          throw new Error("Unable To Create Image");
        }
      });
    }
  } catch (error) {
    throw new Error("Unable To Create Post");
  } finally {
    await prisma.$disconnect();
  }
}

async function updatePostPrisma(
  userId: string,
  post: {
    id: string;
    text: string;
    images: string[];
    oldImages: string[];
  }
) {
  try {
    const updatedPost = await prisma.post.update({
      where: { userId, uid: post.id },
      data: {
        text: post.text,
      },
    });

    if (post.images.length > 0) {
      post.images.map(async (image) => {
        try {
          await prisma.image.create({
            data: {
              key: image,
              postId: updatedPost.uid,
            },
          });
        } catch (error) {
          throw new Error("Unable To Create Image");
        }
      });
    }

    if (post.oldImages.length > 0) {
      post.oldImages.map(async (oldImage) => {
        const url = new URL(oldImage);
        const key = url.pathname.substring(1);
        try {
          const image = await prisma.image.findFirst({
            where: { postId: post.id, key: key },
          });
          if (image) {
            await prisma.image.delete({ where: { id: image.id } });
          }
        } catch (error) {
          throw new Error("Unable To Delete Image");
        }
      });
    }
  } catch (error) {
    throw new Error("Unable To Update Post");
  } finally {
    await prisma.$disconnect();
  }
}

async function deletePostPrisma(userId: string, uid: string) {
  try {
    await prisma.post.delete({
      where: { userId, uid },
    });
  } catch (error) {
    throw new Error("Unable To Delete Post");
  } finally {
    await prisma.$disconnect();
  }
}

async function likePostPrisma(user: string, postId: string) {
  try {
    await prisma.user.update({
      where: { uid: user },
      data: {
        likedPosts: { connect: { uid: postId } },
      },
    });

    return true;
  } catch (error) {
    throw new Error("Unable To Like Post");
  } finally {
    await prisma.$disconnect();
  }
}

async function unlikePostPrisma(user: string, postId: string) {
  try {
    await prisma.user.update({
      where: { uid: user },
      data: {
        likedPosts: { disconnect: { uid: postId } },
      },
    });

    return true;
  } catch (error) {
    throw new Error("Unable To Unlike Post");
  } finally {
    await prisma.$disconnect();
  }
}

export {
  getPostsPrisma,
  getPostPrisma,
  createPostPrisma,
  updatePostPrisma,
  deletePostPrisma,
  likePostPrisma,
  unlikePostPrisma,
};
