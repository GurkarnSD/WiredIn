import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "../../../../lib/prisma/index";
import { createUserPrisma } from "@/lib/prisma/user";
import { compare } from "bcrypt";
import { User } from "@prisma/client";
import { randomUUID } from "crypto";
import { Resend } from "resend";
import ActivateTemplate from "@/emails/activate";

const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Sign In",
      credentials: {
        email: { label: "email", type: "email", placeholder: "Email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        const user = await prisma.credentials.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          throw new Error("User not found");
        }

        if (!user.active) {
          const token = await prisma.activateToken.create({
            data: {
              token: `${randomUUID()}${randomUUID()}`.replace(/-/g, ""),
              credsId: user.id,
            },
          });

          const resend = new Resend(process.env.RESEND_API_KEY);

          await resend.emails.send({
            from: "WiredIn <activation@wiredin.social>",
            to: user.email,
            subject: "Activate Your Account",
            react: ActivateTemplate({
              token: token.token,
              siteURL: process.env.API_URL || "",
              user: user.displayName,
            }),
          });

          throw new Error("User is not active");
        }

        const isPasswordValid = await compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error("Incorrect password");
        }

        const userData = await prisma.user.findUnique({
          where: { uid: user.uid },
        });

        return {
          id: user.id + "",
          uid: user.uid + "",
          email: user.email,
          displayName: user.displayName,
          profilePic: userData?.profilePic,
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    session: ({ session, token }) => {
      return {
        ...session,
        user: {
          ...session.user,
          uid: token.uid,
          displayName: token.displayName,
          profilePic: token.profilePic,
        },
      };
    },
    jwt: async ({ token, user, account }) => {
      if (account?.provider === "google") {
        const googleUser = await prisma.user.findUnique({
          where: { email: user.email! },
        });

        return {
          email: user.email,
          uid: googleUser?.uid,
          displayName: googleUser?.displayName,
          profilePic: googleUser?.profilePic,
        };
      }

      if (user) {
        const u = user as unknown as User;
        return {
          ...token,
          uid: u.uid,
          displayName: u.displayName,
          profilePic: u.profilePic,
        };
      }
      return token;
    },
    signIn: async ({ user, account }) => {
      if (account?.provider === "google") {
        const userExists = await prisma.user.findUnique({
          where: { email: user.email! },
        });

        if (userExists) {
          return Promise.resolve(true);
        }

        const newUser = {
          email: user.email,
          displayName: `${user.name}${
            Math.floor(Math.random() * 900000) + 100000
          }`,
          password: "EXTERNAL_PROVIDER",
        };

        await createUserPrisma(newUser);
      }

      return Promise.resolve(true);
    },
  },
  pages: {
    signIn: "/login",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST, authOptions };
