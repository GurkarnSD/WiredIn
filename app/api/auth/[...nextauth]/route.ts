import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "../../../../lib/prisma/index";
import { createUserPrisma } from "@/lib/prisma/user";
import { compare } from "bcrypt";
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
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          throw new Error("User not found");
        }

        const loginInfo = await prisma.credentials.findFirst({
          where: { userId: user.uid },
          include: {
            ActivateToken: true,
          },
        });

        if (!loginInfo?.ActivateToken?.activatedAt) {
          const token = await prisma.activateToken.upsert({
            where: { credsId: user.uid },
            update: {
              token: `${randomUUID()}${randomUUID()}`.replace(/-/g, ""),
            },
            create: {
              token: `${randomUUID()}${randomUUID()}`.replace(/-/g, ""),
              credsId: user.uid,
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
          loginInfo.password
        );

        if (!isPasswordValid) {
          throw new Error("Incorrect password");
        }

        type UserInfo = {
          email: string;
          password: string;
          userAgent: string;
          ipAddress: string;
          location: string;
        };

        const userInfo: UserInfo = credentials as UserInfo;

        try {
          const session = await prisma.session.create({
            data: {
              credentialsId: user.uid,
              expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
              userAgent: userInfo.userAgent,
              ipAddress: userInfo.ipAddress,
              location: userInfo.location,
            },
          });

          return {
            uid: user.uid + "",
            session: session.id,
            userAgent: userInfo.userAgent,
            ipAddress: userInfo.ipAddress,
            location: userInfo.location,
            email: user.email,
          };
        } catch (e) {
          throw new Error("Failed to create session");
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
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
        const u = user as any;
        return {
          ...token,
          uid: u.uid,
          session: u.session,
          userAgent: u.userAgent,
          ipAddress: u.ipAddress,
          location: u.location,
        };
      }

      return token;
    },
    session: async ({ session, token }) => {
      const sessionInfo = await prisma.session.findUnique({
        where: {
          id: token.session,
        },
      });

      if (!sessionInfo || sessionInfo.expiresAt < new Date()) {
        return null;
      }

      const userInfo = await prisma.user.findUnique({
        where: { uid: token.uid },
      });

      if (!userInfo) {
        return null;
      }

      return {
        ...session,
        userAgent: token.userAgent,
        ipAddress: token.ipAddress,
        location: token.location,
        session: token.session,
        user: {
          ...session.user,
          uid: token.uid,
          email: userInfo.email,
          displayName: userInfo.displayName,
          profilePic: userInfo.profilePic,
        },
      };
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
