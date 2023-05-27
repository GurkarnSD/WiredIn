import styles from '@/styles/Profile.module.css'
import Navbar from '@/components/Navbar'
import Profile from '@/components/Profile/Profile';

export default function ProfilePage({ params }: { params: { user: string } }) {
    const pageUser = params.user;

    return (
        <>
            <Navbar />
            <div className={styles.container}>
                {/* @ts-expect-error Async Server Component */}
                <Profile pageUser={pageUser} />
            </div>
        </>
    )
}
