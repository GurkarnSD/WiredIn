import styles from "@/styles/Messages.module.css"
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import Navbar from "@/components/Navbar"
import Messages from "@/components/Messages"

export default async function MessagesPage() {

    const session = await getServerSession(authOptions);

    return (
        <>
            {/* @ts-expect-error Async Server Component */}
            <Navbar />
            <div className={styles.container}>
                <Messages user={session.user} />
            </div>
        </>)
}