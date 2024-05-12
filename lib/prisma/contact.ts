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

async function uploadContactFormPrisma(
  userId: string,
  contactForm: {
    name: string;
    email: string;
    message: string;
    type: string;
  }
) {
  try {
    await prisma.contactForm.create({
      data: {
        name: contactForm.name,
        email: contactForm.email,
        message: contactForm.message,
        type: contactForm.type,
        userId: userId,
      },
    });
  } catch (error) {
    console.log(error);
    throw new Error("Unable To Upload Contact Form");
  } finally {
    await prisma.$disconnect();
  }
}

export { uploadContactFormPrisma };
