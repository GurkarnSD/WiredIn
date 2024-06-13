import styles from "@/styles/Feed.module.css";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import Navbar from "@/components/Navbar";
import Connect from "@/components/Feed/Connect";
import Feed from "@/components/Feed/Feed";
import ProfileCard from "@/components/Feed/ProfileCard";
import { UserSession } from "@/types";
import { redirect } from "next/navigation";
import { Metadata } from 'next';
import { getUserPresignedUrl } from "@/lib/aws/image";

export const metadata: Metadata = {
  title: 'Feed | WiredIn',
};

export default async function FeedPage() {

  let session = (await getServerSession(authOptions)) as UserSession;
  if (!session) redirect('/');
  const profilePic = (await getUserPresignedUrl(session?.user?.profilePic)).url as string;
  session = { ...session, user: { ...session?.user, profilePic } };

  return (
    <>
      {/* @ts-expect-error Async Server Component */}
      <Navbar />
      <div className={styles.container}>
        <div className={styles.connect}>
          {/* @ts-expect-error Async Server Component */}
          <Connect user={session?.user} />
        </div>
        <Feed user={session?.user} />
        <div className={styles.profileCard}>
          <ProfileCard user={session?.user} />
        </div>
      </div>
    </>
  )
}
