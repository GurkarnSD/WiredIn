import styles from "@/styles/Feed.module.css";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import Navbar from "@/components/Navbar";
import Connect from "@/components/Feed/Connect";
import Feed from "@/components/Feed/Feed";

export const revalidate = 0;

const fetchPosts = async (uid: string) => {
  const res = await fetch(`${process.env.API_URL}/api/feed/posts/?uid=${uid}`)

  if (!res.ok) {
    throw new Error("Failed to fetch posts")
  }

  return res.json()
}

export default async function FeedPage() {

  const session = await getServerSession(authOptions);
  const posts = await fetchPosts(session?.user?.uid)

  return (
    <>
      {/* @ts-expect-error Async Server Component */}
      <Navbar />
      <div className={styles.container}>
        {/* @ts-expect-error Async Server Component */}
        <Connect user={session?.user} />
        <Feed user={session?.user} posts={posts} />
      </div>
    </>
  )
}
