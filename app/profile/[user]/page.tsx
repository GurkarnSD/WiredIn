import styles from '@/styles/Profile.module.css'
import Profile from '@/components/Profile/Profile';
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import Navbar from '@/components/Navbar';

export const revalidate = 0;

const fetchProfileUser = async (pageUser: string) => {
    const res = await fetch(`${process.env.API_URL}/api/users/?name=${pageUser}`)

    if (!res.ok) {
        throw new Error("Failed to fetch user profile")
    }

    return res.json()
}

export default async function ProfilePage({ params }: { params: { user: string } }) {
    const pageUser = params.user;

    const pageData = await fetchProfileUser(pageUser)
    const session = await getServerSession(authOptions)

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
