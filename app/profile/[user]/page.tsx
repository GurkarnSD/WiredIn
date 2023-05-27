import styles from '@/styles/Profile.module.css'
import Navbar from '@/components/Navbar'
import Profile from '@/components/Profile/Profile';

export default function ProfilePage() {

    return (
        <>
            <Navbar />
            <div className={styles.container}>
                <Profile />
            </div>
        </>
    )
}
