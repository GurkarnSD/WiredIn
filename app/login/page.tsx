import Login from "@/components/Login"
import styles from '@/styles/Login.module.css'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import Navbar from "@/components/Navbar"
import { UserSession } from "@/types"
import { Metadata } from 'next';
import { getUserPresignedUrl } from "@/lib/aws/image"

export const metadata: Metadata = {
    title: 'Login | WiredIn',
};


export default async function LoginPage() {

    let session = (await getServerSession(authOptions)) as UserSession;
    if (session) {
        const profilePic = (await getUserPresignedUrl(session?.user?.profilePic)).url as string;
        session = { ...session, user: { ...session?.user, profilePic } };
    }

    return (
        <>
            {/* @ts-expect-error Async Server Component */}
            <Navbar />
            <div className={styles.container}>
                <Login user={session?.user} />
            </div>
        </>
    )
}