import styles from '@/styles/Profile.module.css'
import Profile from '@/components/Profile/Profile';
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import Navbar from '@/components/Navbar';
import { UserSession } from '@/types';
import { notFound, redirect } from 'next/navigation'
import { Metadata } from 'next';

export async function generateMetadata(
    { params }: { params: { user: string } },
): Promise<Metadata> {
    const pageUser = params.user;

    return {
        title: `${pageUser} | WiredIn`
    }
}

export const revalidate = 0;

const fetchProfileUser = async (pageUser: string) => {
    const res = await fetch(`${process.env.API_URL}/api/user/?name=${pageUser}`)

    if (!res.ok) {
        notFound() // throw new Error("Failed to fetch user profile")
    }

    return res.json()
}

export default async function ProfilePage({ params }: { params: { user: string } }) {

    const session = (await getServerSession(authOptions)) as UserSession;
    if (!session) redirect('/')
    const pageUser = params.user;
    const pageData = await fetchProfileUser(pageUser)

    return (
        <>
            {/* @ts-expect-error Async Server Component */}
            <Navbar />
            <div className={styles.container}>
                <Profile pageUser={pageData} user={session?.user} />
            </div>
        </>
    )
}
