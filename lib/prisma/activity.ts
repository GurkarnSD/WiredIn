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

async function getActivityPrisma(userId: string) {
  try {
    const posts = await prisma.post.findMany({
      where: { userId },
      include: {
        images: true,
        _count: { select: { likes: true, comments: true } },
      },
      take: 3,
      orderBy: { createdAt: "desc" },
    });

    const updatedPosts = await Promise.all(
      posts.map(async (post) => {
        if (post.images.length > 0) {
          const image = post.images[0];
          const res = await fetch(
            `${process.env.API_URL}/api/image/${image.key}`
          );
          const data = await res.json();
          return {
            ...post,
            images: [data.url],
          };
        }
        return post;
      })
    );

    return updatedPosts;
  } catch (error) {
    throw new Error("Unable To Get Activity Data");
  } finally {
    await prisma.$disconnect();
  }
}

export { getActivityPrisma };
