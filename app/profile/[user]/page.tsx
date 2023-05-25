'use client';
import styles from '@/styles/Profile.module.css'
import Navbar from '@/components/Navbar'
import useCurrentUser from '@/lib/firebase/user'
import Profile from '@/components/Profile/Profile';

export default function ProfilePage() {

    const user = useCurrentUser()

    return (
        <>
            <Navbar user={user} />
            <div className={styles.container}>
                <Profile />
            </div>
        </>
    )
}
