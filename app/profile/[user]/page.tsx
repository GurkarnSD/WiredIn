import styles from '@/styles/Profile.module.css'
import Navbar from '@/components/Navbar'
import Profile from '@/components/Profile/Profile';

export const revalidate = 30;

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

    return (
        <>
            <Navbar />
            <div className={styles.container}>
                <Profile pageUser={pageData} />
            </div>
        </>
    )
}
