import { UserProfile } from '@/types';
import styles from '../styles/Profile/ProfileActivity.module.css'

export default function ProfileActivity(params: { pageUser: UserProfile }) {

    const { pageUser } = params;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.title}>Activity</div>
            </div>
        </div>
    )
}