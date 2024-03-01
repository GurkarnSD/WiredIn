import styles from "@/styles/Feed.module.css";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import Navbar from "@/components/Navbar";
import Connect from "@/components/Feed/Connect";
import Feed from "@/components/Feed/Feed";
import ProfileCard from "@/components/Feed/ProfileCard";
import { UserSession } from "@/types";

export const revalidate = 0;

const fetchPosts = async (uid: string) => {
  const res = await fetch(`${process.env.API_URL}/api/feed/posts/?uid=${uid}`)

  if (!res.ok) {
    throw new Error("Failed to fetch posts")
  }

  return res.json()
}

const fetchProfileImage = async (profileKey: string) => {
  const res = await fetch(`${process.env.API_URL}/api/image/${profileKey}`);

  if (!res.ok) {
    throw new Error('Failed to Fetch Image Url')
  }

  const { url: profileURL } = await res.json();
  return profileURL;
}

export default async function FeedPage() {

  let session = (await getServerSession(authOptions)) as UserSession;

  const posts = await fetchPosts(session?.user?.uid)

  const profilePic = await fetchProfileImage(session?.user?.profilePic);
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
        <Feed user={session?.user} posts={posts} />
        <div className={styles.profileCard}>
          <ProfileCard user={session?.user} />
        </div>
      </div>
    </>
  )
}
