import styles from "@/styles/Feed.module.css";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import Navbar from "@/components/Navbar";
import Connect from "@/components/Feed/Connect";

export default async function FeedPage() {

  const session = await getServerSession(authOptions);

  return (
    <>
      {/* @ts-expect-error Async Server Component */}
      <Navbar />
      <div className={styles.container}>
        {/* @ts-expect-error Async Server Component */}
        <Connect user={session?.user} />
      </div>
    </>
  )
}
