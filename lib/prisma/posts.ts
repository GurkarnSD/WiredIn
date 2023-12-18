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

async function getPostsPrisma(userId: string) {
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
          },
        },
      },
    });

    const updatedPosts = await Promise.all(
      posts.map(async (post) => {
        if (post.user.profilePic) {
          const res = await fetch(
            `${process.env.API_URL}/api/image/${post.user.profilePic}`
          );
          const image = await res.json();

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
              user: { ...user, profilePic: image.url },
              images: imageUrls,
            };
          }
          return { ...post, user: { ...user, profilePic: image.url } };
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
              postId: createdPost.id,
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

async function deletePostPrisma(id: string) {
  try {
    const queryId = parseInt(id, 10);

    await prisma.post.delete({
      where: { id: queryId },
    });
  } catch (error) {
    throw new Error("Unable To Delete Post");
  } finally {
    await prisma.$disconnect();
  }
}

async function likePostPrisma(user: string, postId: number) {
  try {
    await prisma.user.update({
      where: { uid: user },
      data: {
        likedPosts: { connect: { id: postId } },
      },
    });

    return true;
  } catch (error) {
    throw new Error("Unable To Like Post");
  } finally {
    await prisma.$disconnect();
  }
}

async function unlikePostPrisma(user: string, postId: number) {
  try {
    await prisma.user.update({
      where: { uid: user },
      data: {
        likedPosts: { disconnect: { id: postId } },
      },
    });

    return true;
  } catch (error) {
    throw new Error("Unable To Like Post");
  } finally {
    await prisma.$disconnect();
  }
}

export {
  getPostsPrisma,
  createPostPrisma,
  deletePostPrisma,
  likePostPrisma,
  unlikePostPrisma,
};
