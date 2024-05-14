import NextAuth, { NextAuthOptions } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "../../../../lib/prisma/index";
import { compare } from "bcrypt";
import { randomUUID } from "crypto";
import { Resend } from "resend";
import ActivateTemplate from "@/emails/activate";

const getOptions = (req: NextRequest): NextAuthOptions => {
  return {
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

          try {
            const { headers, url } = req;
            const { searchParams } = new URL(url);
            const ipAddress = searchParams.get("ip");
            const location = searchParams.get("location");
            const userAgent = headers.get("user-agent");

            const session = await prisma.session.create({
              data: {
                credentialsId: user.uid,
                expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
                userAgent: userAgent || "",
                ipAddress: ipAddress || "",
                location: location || "",
              },
            });

            return {
              uid: user.uid + "",
              session: session.id,
              userAgent: userAgent,
              ipAddress: ipAddress,
              location: location,
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

          const googleSession = await prisma.session.findFirst({
            where: { credentialsId: googleUser?.uid },
          });

          return {
            uid: googleUser?.uid,
            session: googleSession?.id,
            userAgent: "EXTERNAL_PROVIDER",
            ipAddress: googleSession?.ipAddress,
            location: googleSession?.location,
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
      session: async ({ session, user, token }) => {
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
        if (account?.provider === "google" && user?.email) {
          let userExists = await prisma.user.findUnique({
            where: { email: user.email! },
          });

          if (!userExists) {
            const userData = {
              email: user.email.toLowerCase(),
              displayName: `${user.name}${
                Math.floor(Math.random() * 900000) + 100000
              }`,
            };
            userExists = await prisma.user.create({ data: userData });
            console.log("User created:", userExists);

            const credentials = await prisma.credentials.create({
              data: {
                password: "EXTERNAL_PROVIDER",
                userId: userExists.uid,
              },
            });
          }

          const { headers, url } = req;
          const { searchParams } = new URL(url);
          const ipAddress = searchParams.get("ip");
          const location = searchParams.get("location");
          const userAgent = headers.get("user-agent") || "EXTERNAL_PROVIDER";

          // Somehow get user agent here
          if (process.env.NODE_ENV !== "production") {
            await prisma.session.create({
              data: {
                credentialsId: userExists.uid,
                expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
                userAgent: userAgent,
                ipAddress: "Localhost",
                location: "Developer, Environment, Computer",
              },
            });
          } else {
            await prisma.session.create({
              data: {
                credentialsId: userExists.uid,
                expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
                userAgent: userAgent,
                ipAddress: ipAddress || "",
                location: location || "",
              },
            });
          }
        }

        return Promise.resolve(true);
      },
    },
    pages: {
      signIn: "/login",
    },
  };
};

const authOptions: NextAuthOptions = getOptions({} as NextRequest);

export async function GET(req: NextRequest, res: NextResponse) {
  return NextAuth(req, res, getOptions(req) as NextAuthOptions);
}

export async function POST(req: NextRequest, res: NextResponse) {
  return NextAuth(req, res, getOptions(req) as NextAuthOptions);
}

export { authOptions };
